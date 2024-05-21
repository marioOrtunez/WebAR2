var one =     document.querySelector('#one');
var two = document.querySelector('#two');
var three = document.querySelector('#three');
one.addEventListener('click', function () {
          camera.emit('one');
          });
two.addEventListener('click', function () {
          camera.emit('two');
                    });

three.addEventListener('click', function () {
          camera.emit('three');
            });