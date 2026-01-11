var el = $('#number');
el.change(function () {
  var frame = document.createElement('iframe');
  frame.src = el.val();
  $('#loadContainer').empty().append(frame);
});
