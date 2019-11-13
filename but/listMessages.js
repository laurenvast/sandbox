function listMessages() {
  var request = gapi.client.gmail.users.messages.list({
    'userId': 'me',
    'labelIds': 'Label_13',
    'maxResults': 1
  });

  request.execute(function(response) {
    $.each(response.messages, function() {
      var messageRequest = gapi.client.gmail.users.messages.get({
        'userId': 'me',
        'id': this.id
      });

      messageRequest.execute(test);
    });
  });
}

function test(message) {
 // console.log(message.result.snippet);
  newText = message.result.snippet;
}

// var getPageOfMessages = function(request, result) {
//   console.log("ahh");

//   request.execute(function(resp) {
//     result = result.concat(resp.messages);
//     var nextPageToken = resp.nextPageToken;
//     if (nextPageToken) {
//       request = gapi.client.gmail.users.messages.list({
//         'userId': 'me',
//         'labelIds': 'Label_13',
//         'q': 'but',
//       });
//       getPageOfMessages(request, result);
//       messageIds = result[0].id;

//       var request2 = gapi.client.gmail.users.messages.get({
//         'userId': 'me',
//         'id': messageIds, //'15422262e5aba2ee',
//       });
//       request2.then(function(resp) {
//         newText = resp.result.snippet;
//         console.log(newText);
//       }, function(reason) {
//         console.log('Error: ' + reason.result.error.message);
//       });
//     }
//     //console.log(messageIds);
//   });
// };
// var initialRequest = gapi.client.gmail.users.messages.list({
//   'userId': 'me',
//   'labelIds': 'Label_13',
//   'q': 'but',
// });
// getPageOfMessages(initialRequest, []);
//}