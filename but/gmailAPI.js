function checkAuth() {
  gapi.auth.authorize({
    'client_id': CLIENT_ID,
    'scope': SCOPES.join(' '),
    'immediate': true
  }, handleAuthResult);
}

/**
 * Handle response from authorization server.
 *
 * @param {Object} authResult Authorization result.
 */
function handleAuthResult(authResult) {
  var authorizeDiv = document.getElementById('authorize-div');
  if (authResult && !authResult.error) {
    // Hide auth UI, then load client library.
    authorizeDiv.style.display = 'none';
    loadGmailApi();
  } else {
    // Show auth UI, allowing the user to initiate authorization by
    // clicking authorize button.
    authorizeDiv.style.display = 'inline';
  }
}

/**
 * Initiate auth flow in response to user clicking authorize button.
 *
 * @param {Event} event Button click event.
 */
function handleAuthClick(event) {
  gapi.auth.authorize({
      client_id: CLIENT_ID,
      scope: SCOPES,
      immediate: false
    },
    handleAuthResult);
  return false;
}

/**
 * Load Gmail API client library. List labels once client library
 * is loaded.
 */
function loadGmailApi() {
  gapi.client.load('gmail', 'v1', listMessages);
}



/**
 * Print all Labels in the authorized user's inbox. If no labels
 * are found an appropriate message is printed.
 */




// function getMessage(messageId) {
//   //var messageId;
//   //var request;
//   //for (var i = 0; i < messageIds.length; i++) {
//   request = gapi.client.gmail.users.messages.get({
//     'userId': 'me',
//     'id': messageId, //'15421382548d427a',
//     // ' format': 'minimal',
//     // 'fields': 'snippet'
//   });
//   request.then(function(resp) {
//     //for (var i = 0; i < messageIds.length; i++) {
//     console.log(resp.result.snippet);
//     //}
//   });
// }



/**
 * Append a pre element to the body containing the given message
 * as its text node.
 *
 * @param {string} message Text to be placed in pre element.
 */

// }