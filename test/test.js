const supertest = require('supertest');
const app = require('../app.js');
var expect = require('chai').expect;
describe("Testing he app API", () =>{
	it("tests the get and returns 200 for status", async() => {
		const response = await supertest(app).get('/location/:definition');

		expect(response.status).to.equal(200);
		//expect(response.body.status).toBe(true);
	});

	it("tests the post utility endpoint and returns as success message", async () => {

		const response = await supertest(app).post('/utility').send({
			key: '14ENG',
			description: 'In the basement, Room 85.  Two microwaves available.',
			type: 'Microwave',
			verified: false
		});

		expect(response.status).to.equal(200);
	});

//cd Desktop/cs407/final\ proj/orgMap 

})