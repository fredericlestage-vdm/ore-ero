// Put code in here.
// Embed this at the bottom of the body.
/* global $ YamlWriter USERNAME REPO_NAME YAML PRBOT_URL */

function getSelectedOrgType() {
  return $('#adminCode :selected')
    .parent()
    .attr('label')
    .toLowerCase();
}

/**
 * Validates the required fields in the codeForm
 * WET uses the JQuery plugin (https://jqueryvalidation.org/) for their form validation
 * @return {Boolean} true/false if the form is valid/invalid
 */
function validateRequired() {
  let form = document.getElementById('validation');
  let elements = form.elements;
  let validator = $('#validation').validate();
  let isValid = true;
  for (let i = 0; i < elements.length; i++) {
    let currentElement = elements[i];
    if (currentElement.required) {
      if (!validator.element('#' + currentElement.id)) {
        isValid = false;
      }
    }
  }
  if (!isValid) {
    // Jump to top of form to see error messages
    location.href = '#wb-cont';
  }
  return isValid;
}

const ALERT_IN_PROGRESS = 0;
const ALERT_FAIL = 1;
const ALERT_SUCCESS = 2;
const ALERT_OFF = 3;

function toggleAlert(option) {
  let alertInProgress = document.getElementById('prbotSubmitAlertInProgress');
  let alertFail = document.getElementById('prbotSubmitAlertFail');
  let alertSuccess = document.getElementById('prbotSubmitAlertSuccess');
  if (option == ALERT_IN_PROGRESS) {
    alertInProgress.style.display = 'block';
  } else if (option == ALERT_FAIL) {
    alertFail.style.display = 'block';
  } else if (option == ALERT_SUCCESS) {
    alertSuccess.style.display = 'block';
  } else if (option == ALERT_OFF) {
    alertInProgress.style.display = 'none';
    alertFail.style.display = 'none';
    alertSuccess.style.display = 'none';
  } else {
    console.log('Invalid alert option');
  }
}

function submitForm() {
  let submitButton = document.getElementById('prbotSubmit');
  let resetButton = document.getElementById('codeFormReset');
  submitButton.disabled = true;
  resetButton.disabled = true;
  
  let contentPrime = 
  `- code: ${$('#adminCode').val()}
  provinceCode: "${$('#provinceCode').val()}"
  name:
    en: ${$('#enAdminName').val()}
    fr: ${$('#frAdminName').val()}
  `;

  let fileWriter = new YamlWriter(USERNAME, REPO_NAME);
  let filePrime = `_data/administrations/municipal.yml`;

  fileWriter.merge(filePrime, contentPrime, "code", "name.en").then(result =>{
    const config = {
      body: JSON.stringify({
        user: USERNAME,
        repo: REPO_NAME,
        title: 'Updated administrations ',
        description:
          'Authored by: ' +
          $('#submitterEmail').val() +
          '\n',
        commit: 'Committed by ' + $('#submitterEmail').val(),
        author: {
          name: $('#submitterUsername').val(),
          email: $('#submitterEmail').val()
        },
        files: [
          {
            path: filePrime,
            contentPrime: YAML.stringify(result, { keepBlobsInJSON: false })
          }
        ]
      }),
      method: 'POST'
    };
    return fetch(PRBOT_URL, config);
  }).catch(err => {
      if (err.status == 404) {
        const config = {
          body: JSON.stringify({
            user: USERNAME,
            repo: REPO_NAME,
            title: 'Created administration',
            description:
              'Authored by: ' +
              $('#submitterEmail').val() +
              '\n',
            commit: 'Committed by ' + $('#submitterEmail').val(),
            author: {
              name: $('#submitterUsername').val(),
              email: $('#submitterEmail').val()
            },
            files: [
              {
                path: filePrime,
                contentPrime: content
              }
            ]
          }),
          method: 'POST'
        };
        return fetch(PRBOT_URL, config);
      } else {
        throw err;
      }
    })
    .then(response => {
      if (response.status != 200) {
        toggleAlert(ALERT_OFF);
        toggleAlert(ALERT_FAIL);
        submitButton.disabled = false;
        resetButton.disabled = false;
      } else {
        toggleAlert(ALERT_OFF);
        toggleAlert(ALERT_SUCCESS);
        // Redirect to home page
        setTimeout(function() {
          window.location.href = './index.html';
        }, 2000);
      }
    });
}

$('#prbotSubmit').click(function() {
  // Progress only when form input is valid
  if (validateRequired()) {
    toggleAlert(ALERT_OFF);
    toggleAlert(ALERT_IN_PROGRESS);
    window.scrollTo(0, document.body.scrollHeight);
    submitForm();
  }
});
