import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import request from "supertest";
import { expect, it } from "@jest/globals";
import app from "../index";
import { randomIntFromInterval, serializedObjProps } from "../utils";
import { Package, Cabinet, User } from "../models";
import { AuthService } from "../services";

mongoose.Promise = global.Promise;

const supertest = request(app);

const generateDummyPackage = () => ({
  address: {
    street: "1234 Test",
    zipcode: "1338",
    phone: "1234",
    city: "the world",
    loc: {
      x: randomIntFromInterval(15, 100),
      y: randomIntFromInterval(15, 100),
    },
  },
  dimension: { height: randomIntFromInterval(1, 30), width: randomIntFromInterval(1, 30), depth: randomIntFromInterval(1, 30) },
});

const generateDummyLocker = () => ({
  height: randomIntFromInterval(1, 150),
  width: randomIntFromInterval(1, 150),
  depth: randomIntFromInterval(1, 150),
});

const generateDummyCabinet = () => ({
  address: {
    street: "Test 123",
    zipcode: "1337",
    city: "world",
    loc: {
      x: randomIntFromInterval(15, 100),
      y: randomIntFromInterval(15, 100),
    },
  },
  lockers: Array.from(Array(16).keys()).map(() => generateDummyLocker()),
});

let mongoServer;
let TOKEN;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = await mongoServer.getUri();
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
  });
  const cabinets = Array.from(Array(50).keys()).map(() => generateDummyCabinet());
  const packages = Array.from(Array(20).keys()).map(() => generateDummyPackage());
  // Promise fix for broken insertMany
  await new Promise((resolve, reject) => {
    Cabinet.insertMany(cabinets, (err) => {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });
  await new Promise((resolve, reject) => {
    Package.insertMany(packages, (err) => {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });
  const userData = { email: "test@test.com", password: "Hello12345@" };
  const user = new User(userData);
  await user.save();
  const authService = new AuthService();
  const tokenResponse = await authService.login({ input: { body: userData } });
  TOKEN = tokenResponse.access_token;
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe("/v1/packages", () => {
  let createdPackage;
  const packageData = {
    address: {
      street: "Test 123",
      zipcode: "1337",
      phone: "123",
      city: "world",
      loc: {
        x: 60.13993787457239,
        y: 15.196131420732488,
      },
    },
    dimension: { height: 30, width: 30, depth: 30 },
  };
  describe("Generic Content validation", () => {
    it("Should require application/json content-type header when req has body", (done) => {
      supertest
        .post("/v1/package")
        .send("")
        .set({ "Content-Type": "text/plain", Accept: "application/json", Authorization: `Bearer ${TOKEN}` })
        .end((error, response) => {
          expect(response.status).toBe(415);
          done();
        });
    });

    it("Should require application/json accepts header", (done) => {
      supertest
        .post("/v1/package")
        .send(packageData)
        .set({ "Content-Type": "application/json", Accept: "text/plain", Authorization: `Bearer ${TOKEN}` })
        .end((error, response) => {
          expect(response.status).toBe(406);
          done();
        });
    });
  });
  describe("[POST] create", () => {
    it("should be protected route", (done) => {
      supertest
        .post("/v1/package")
        .send(packageData)
        .set("Accept", "application/json")
        .end((err, res) => {
          expect(res.status).toBe(401);
          done();
        });
    });
    it("should match snapshot", (done) => {
      supertest
        .post("/v1/package")
        .send(packageData)
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${TOKEN}`)
        .end((error, response) => {
          // strip _id, date to avoid snapshot collision.
          createdPackage = { ...response.body.data };
          const [serializedObj] = serializedObjProps([response.body.data], ["_id", "createdAt", "updatedAt", "carrier"]);
          const [serializedHeaders] = serializedObjProps([response.headers], ["date"]);
          const serializedBody = {
            ...response.body,
            data: serializedObj,
          };
          expect(serializedBody).toMatchSnapshot();
          expect(error).toMatchSnapshot();
          expect(serializedHeaders).toMatchSnapshot();
          expect(response.status).toBe(201);
          done();
        });
    });
    it("should have allocated a locker at a cabinet", (done) => {
      Cabinet.find({ "lockers.allocated": createdPackage._id }).then((value) => {
        expect(value.length).toBe(1);
        done();
      });
    });
  });
  describe("[GET] get one", () => {
    it("should be protected route", (done) => {
      supertest
        .get("/v1/package/1")
        .set("Accept", "application/json")
        .end((err, res) => {
          expect(res.status).toBe(401);
          done();
        });
    });
    it("should match snapshot", (done) => {
      supertest
        .get(`/v1/package/${createdPackage._id}`)
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${TOKEN}`)
        .end((err, res) => {
          const [serializedObj] = serializedObjProps([res.body.data], ["_id", "createdAt", "updatedAt", "carrier"]);
          const [serializedHeaders] = serializedObjProps([res.headers], ["date", "location"]);
          const serializedBody = {
            ...res.body,
            data: serializedObj,
          };
          expect(serializedBody).toMatchSnapshot();
          expect(err).toMatchSnapshot();
          expect(serializedHeaders).toMatchSnapshot();
          expect(res.status).toBe(200);
          done();
        });
    });
  });
  describe("[GET] get many", () => {
    it("should be protected route", (done) => {
      supertest
        .get("/v1/package")
        .set("Accept", "application/json")
        .end((err, res) => {
          expect(res.status).toBe(401);
          done();
        });
    });
    describe("with default params", () => {
      it("should match snapshot", (done) => {
        supertest
          .get(`/v1/package/`)
          .set("Accept", "application/json")
          .set("Authorization", `Bearer ${TOKEN}`)
          .end((err, res) => {
            const serializedBody = serializedObjProps(res.body, [
              "_id",
              "createdAt",
              "updatedAt",
              "carrier",
              "x",
              "y",
              "height",
              "depth",
              "next",
              "width",
            ]);
            const [serializedHeaders] = serializedObjProps([res.headers], ["date", "location", "content-length"]);
            expect(serializedBody).toMatchSnapshot();
            expect(err).toMatchSnapshot();
            expect(serializedHeaders).toMatchSnapshot();
            expect(res.status).toBe(200);
            done();
          });
      });
    });
    describe("with with limit", () => {
      it("should match snapshot", (done) => {
        supertest
          .get(`/v1/package/?limit=5`)
          .set("Accept", "application/json")
          .set("Authorization", `Bearer ${TOKEN}`)
          .end((err, res) => {
            const serializedBody = serializedObjProps(res.body, [
              "x",
              "y",
              "height",
              "width",
              "depth",
              "updatedAt",
              "createdAt",
              "_id",
              "carrier",
              "next",
            ]);
            const [serializedHeaders] = serializedObjProps([res.headers], ["date", "location", "content-length"]);
            expect(serializedBody).toMatchSnapshot();
            expect(serializedBody.data.result.length).toBe(5);
            expect(err).toMatchSnapshot();
            expect(serializedHeaders).toMatchSnapshot();
            expect(res.status).toBe(200);
            done();
          });
      });
    });
    describe("with fields", () => {
      it("should match snapshot", (done) => {
        supertest
          .get(`/v1/package/?fields=address,carrier`)
          .set("Accept", "application/json")
          .set("Authorization", `Bearer ${TOKEN}`)
          .end((err, res) => {
            const serializedBody = serializedObjProps(res.body.data.result, [
              "x",
              "y",
              "height",
              "width",
              "depth",
              "updatedAt",
              "createdAt",
              "_id",
              "carrier",
              "next",
            ]);
            const [serializedHeaders] = serializedObjProps([res.headers], ["date", "location", "content-length"]);
            expect(serializedBody).toMatchSnapshot();
            expect(err).toMatchSnapshot();
            expect(serializedHeaders).toMatchSnapshot();
            expect(res.status).toBe(200);
            done();
          });
      });
    });
    describe("with sortBy", () => {
      it("should match snapshot", (done) => {
        supertest
          .get(`/v1/package/?sortBy=carrier`)
          .set("Accept", "application/json")
          .set("Authorization", `Bearer ${TOKEN}`)
          .end((err, res) => {
            const serializedBody = serializedObjProps(res.body, [
              "x",
              "y",
              "height",
              "width",
              "depth",
              "updatedAt",
              "createdAt",
              "_id",
              "carrier",
              "next",
            ]);
            const [serializedHeaders] = serializedObjProps([res.headers], ["date", "location", "content-length"]);
            expect(serializedBody).toMatchSnapshot();
            expect(err).toMatchSnapshot();
            expect(serializedHeaders).toMatchSnapshot();
            expect(res.status).toBe(200);
            done();
          });
      });
    });
    describe("with pagination", () => {
      it("should match snapshot", (done) => {
        supertest
          .get(`/v1/package/?limit=5`)
          .set("Accept", "application/json")
          .set("Authorization", `Bearer ${TOKEN}`)
          .end((err, res) => {
            const serializedArr = serializedObjProps(res.body.data.result, [
              "_id",
              "createdAt",
              "updatedAt",
              "carrier",
              "x",
              "y",
              "height",
              "depth",
              "width",
            ]);
            const [serializedHeaders] = serializedObjProps([res.headers], ["date", "location", "content-length"]);
            const [serializedRoot] = serializedObjProps([res.body.data], ["next"]);
            const serializedBody = {
              ...res.body,
              data: {
                ...serializedRoot,
                result: serializedArr,
              },
            };
            expect(serializedBody).toMatchSnapshot();
            expect(serializedBody.data.result.length).toBe(5);
            expect(serializedBody.data.has_more).toBe(true);
            expect(res.body.data.next).not.toBe(null);
            expect(res.body.data.next).toBe(res.body.data.result[res.body.data.result.length - 1]._id);
            expect(err).toMatchSnapshot();
            expect(serializedHeaders).toMatchSnapshot();
            expect(res.status).toBe(200);
            done();
          });
      });
    });
  });
  describe("[PATCH] update one", () => {
    it("should be protected route", (done) => {
      supertest
        .patch("/v1/package/1")
        .send({})
        .set("Accept", "application/json")
        .end((err, res) => {
          expect(res.status).toBe(401);
          done();
        });
    });
    it("should update resource at persistant storage", (done) => {
      const newStreet = "new address";
      supertest
        .patch(`/v1/package/${createdPackage._id}`)
        .send({ address: { street: newStreet } })
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${TOKEN}`)
        .end((err, res) => {
          Package.findOne({ _id: createdPackage._id }).then((value) => {
            const [serializedObj] = serializedObjProps([res.body.data], ["_id", "createdAt", "updatedAt", "carrier"]);
            const [serializedHeaders] = serializedObjProps([res.headers], ["date", "content-length", "location"]);
            const serializedBody = {
              ...res.body,
              data: serializedObj,
            };
            expect(serializedBody).toMatchSnapshot();
            expect(value.address.street).toBe(newStreet);
            expect(serializedBody.data.address.street).not.toBe(createdPackage.address.street);
            expect(err).toMatchSnapshot();
            expect(serializedHeaders).toMatchSnapshot();
            expect(res.status).toBe(200);
            done();
          });
        });
    });
  });
  describe("[DELETE] delete one", () => {
    it("should be protected route", (done) => {
      supertest
        .delete("/v1/package/1")
        .set("Accept", "application/json")
        .end((err, res) => {
          expect(res.status).toBe(401);
          done();
        });
    });
    it("should have been removed from persistant storage", (end) => {
      supertest
        .delete(`/v1/package/${createdPackage._id}`)
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${TOKEN}`)
        .end(async (err, res) => {
          Package.findOne({ _id: createdPackage._id }).then((value) => {
            expect(res.status).toBe(204);
            expect(value).toBe(null);
            end();
          });
        });
    });
  });
});
