document.addEventListener('DOMContentLoaded', function () {
  var one = document.querySelector('#one');
  var two = document.querySelector('#two');
  var three = document.querySelector('#three');
  var camera = document.querySelector('#camera');

  var at = "one";
  one.addEventListener('click', function () {
      if (at !== "one") {
          at = "one";
          camera.emit('one');
      }
  });
  two.addEventListener('click', function () {
      if (at !== "two") {
          at = "two";
          camera.emit('two');
      }
  });
  three.addEventListener('click', function () {
      if (at !== "three") {
          at = "three";
          camera.emit('three');
      }
  });
});
