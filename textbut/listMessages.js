function listMessages() {
  var getPageOfMessages = function(request, result) {
    request.execute(function(resp) {
      result = result.concat(resp.messages);
      var nextPageToken = resp.nextPageToken;
      if (nextPageToken) {
        request = gapi.client.gmail.users.messages.list({
          'userId': 'me',
          'labelIds': 'Label_13',
          'q': 'but'
        });
        getPageOfMessages(request, result);
      }
      //var index = 0;
      messageIds = result[0].id;

      //console.log(messageIds);
    });
  };
  var initialRequest = gapi.client.gmail.users.messages.list({
    'userId': 'me',
    'labelIds': 'Label_13',
    'q': 'but'
  });
  getPageOfMessages(initialRequest, []);

    request = gapi.client.gmail.users.messages.get({
      'userId': 'me',
      'id': messageIds, //'15422262e5aba2ee',
    });
    request.then(function(resp) {
      //for (var i = 0; i < messageIds.length; i++) {
      newText = resp.result.snippet;
      //console.log(newText);
      //}
    });
}