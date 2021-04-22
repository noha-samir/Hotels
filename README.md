<h3 align="center">
<b>Hotel Search</b></h3>

## 📝 Table of Contents

<!-- - [About](#about) -->
- [Getting Started](#getting_started)
- [Built Using](#built_using)

## 🏁 Getting Started <a name = "getting_started"></a>

 - clone project.
 - install node_modules "npm install".
 - start server "npm start".

### Dependencies

- [Nodemon](https://nodemon.io/) nodemon for npm run watch command
- [async](https://www.npmjs.com/package/async)
- [babel](https://www.npmjs.com/package/babel-install)
- [babel-node](https://www.npmjs.com/package/babel-node)
- [compression](https://www.npmjs.com/package/compression)
- [express](https://expressjs.com/)
- [request](https://www.npmjs.com/package/request)
- [babel-cli](https://www.npmjs.com/package/babel-cli)

### Installing Env
Development env must contains 
- [NodeJs](https://nodejs.org/en/) - Server Environment

## 🔧 Running the tests <a name = "tests"></a>

Test if server working
  - Run  curl localhost:3000
  - Response should be >> {helloooo}

Run search API using postman or any other tool 
  - API >> http://localhost:3000/api/v1/hotel/search
  - METHOD >> POST
  - BODY >> {
	 "name":"",
     "city":"",
     "lowPriceRange":null,
     "highPriceRange":null,
     "fromDate":"",
     "toDate":"",
     "sortedByName":false,
     "sortedByPrice":true,
     "ascSort":true
}
  - RESPONSE >> Array of hotels

Test cases in TESTCASES file
  - This file will be have the body of the request and supposed response

## ⛏️ Built Using <a name = "built_using"></a>

- [Express](https://expressjs.com/) - Server Framework
- [NodeJs](https://nodejs.org/en/) - Server Environment
