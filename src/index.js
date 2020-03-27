import "./less/index.less";
import "./less/index copy.less";
import "./css/base1.css";
import "../public/js/base";
import "../public/js/another";
import "./assets/QQ图片20191230082601.jpg";
import "./assets/QQ图片20191230082605.jpg";
class Person {
  constructor(name) {
    this.name = name;
  }
  getName() {
    return this.name;
  }
}

const fmy = new Person("fmy");
console.log(111);

if (module && module.hot) {
  module.hot.accept(["./base.js"], () => {
    render();
  });
}

if (DEV === "dev") {
  console.log("开发环境");
} else {
  console.log("生产环境");
}

fetch("/api/user")
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(err => console.log(err));

fetch("sex")
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(err => console.log(err));

fetch("/login/account", {
  method: "POST",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    username: "admin",
    password: "888888"
  })
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(err => console.log(err));
