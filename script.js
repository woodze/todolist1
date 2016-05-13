var firebaseRef = new Firebase('https://dazzling-inferno-9377.firebaseio.com/');

$(function() {

$('#login').on('click', function() {

  var url = 'https://dazzling-inferno-9377.firebaseio.com/' + $('#username').val();
  $.getJSON(url, function(data) {
    if (data != null && data.firebaseAuthToken != null) {
      firebaseRef.unauth();
      firebaseRef.auth(data.firebaseAuthToken);

      var payload = atob(data.firebaseAuthToken.split('.')[1]);
      $('#token').text('Logged in: ' + payload);
    }
  });
});


var names = ['school', 'chore', 'grocery' ];
for (var i = 0; i < names.length; i++) {
  var name = names[i];


  firebaseRef.child(name).on('child_added', function(name){

    return function(snapshot) {
      var todo = snapshot.val();
      var item = $('<li>').text(todo.todo + ' (' + todo.from + ')');
      item.attr("id", name + '-' + snapshot.name())
      $('#' + name + '-list').append(item);
    }
  }(name));


  firebaseRef.child(name).on('child_removed', function(name){
    return function(snapshot) {
      $('#' + name + '-' + snapshot.name()).remove();
    }
  }(name));


  $('#' + name + '-add').on('click', function(name){
    return function() {
      var item = {
        from: $('#username').val(),
        todo: $('#' + name + '-todo').val()
      };
      firebaseRef.child(name).push(item);
      $('#' + name + '-todo').val('');
    }
  }(name));
}

});