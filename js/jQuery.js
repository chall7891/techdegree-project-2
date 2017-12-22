//Declares global variables and assigns their values
//These variables work without the eq(0) for some reason
const $pageDiv = $('.page').eq(0);
const pageDivElem = $pageDiv[0];
const $headerDiv = $('.page-header').eq(0);
const $studentUl = $('.student-list').eq(0);
const $studentList = $($studentUl).children();
let $inputValue = '';
let pageNumber = '1';

//Creates and returns an element with an attribute and value as specified in the
//arguments passed to the function.
function createElement(elementType, attribute, attributeValue) {
  const $element = $(
    '<' + elementType + '></' + elementType + '>'
  );
  if(attribute !== '') {
    if(attribute === 'textContent')
      $($element).text(attributeValue);
    else
      $($element).attr(attribute, attributeValue);
  }
  return $element;
}

//When page loads, showPage(), appendStudentSearchBar() and appendPageLinks()
//are called.
window.onload = function() {
  showPage(1, $studentList);
  appendStudentSearchBar($studentList);
  appendPageLinks($studentList);
}

//Takes a page number and student list as arguments. Hides all student links currently displayed,
//then displays ten students within a range based on the page number parameter.
function showPage (pageNumber, studentList) {
  hideList(studentList);
  for(let i = 1; i <= studentList.length; i++) {
    const li = studentList[i - 1];
    if(i >= getLowerRange(pageNumber) &&
       i <= getUpperRange(pageNumber))
        li.style.display = '';
  }
}

//Returns the lower range for students to be displayed based on the page number parameter.
function getLowerRange (pageNumber) {
    return (pageNumber * 10) - 9;
}

//Returns the upper range for students to be displayed based on the page number parameter.
function getUpperRange (pageNumber) {
  return pageNumber * 10;
}

//Takes a student list as an argument and creates a search input and button for studentList searches.
//Adds event listeners to both the input and button elements to allow for click and enter searches.
//Appends the items to the header div. Each event handler calls searchList().
function appendStudentSearchBar(studentList) {
  const $div = createElement('div', 'class', 'student-search');
  const $input = createElement('input', 'placeholder', 'Search for students...');
  const $button = createElement('button', 'textContent', 'Search');
  $($input).on('change', function () {
    searchList(studentList);
  });
  $($button).on('click', function () {
    searchList(studentList);
  });
  $($div).append($input);
  $($div).append($button);
  $($headerDiv).append($div);
}

//Takes a student list as an argument. Creates an empty array literal for student search matches.
//Assigns the search input value to inputValue. Calls hideList() and removeElement() to clear all student
//links and page numbers. Loops through students and determines if student names or emails contain the
//search input. Adds matching items to the matchedStudents array. Calls evaluateSearchMatches().
function searchList (studentList) {
  const matchedStudents = [];
  const $paginationDiv = $('.pagination');
  const paginationDivElem = $paginationDiv[0];
  $inputValue = $('input').val();
  if($inputValue !== '') {
      hideList(studentList);
        //both of these work for some reason
      removeElement($paginationDiv);
      //removeElement(paginationDivElem);
      for(let i = 0; i < studentList.length; i++) {
        //Need to work on comparisons with jQuery
        const name = studentList[i].getElementsByTagName('h3')[0].textContent;
        const email = studentList[i].getElementsByClassName('email')[0].textContent;
        if(name.includes($.trim($inputValue).toLowerCase()) ||
           email.includes($.trim($inputValue).toLowerCase()))
             matchedStudents.push(studentList[i]);
      }
      evaluateSearchMatches(matchedStudents);
  } else
      alert('Please enter a search term before attempting a search.');
}

//Takes a matchedInputArray as an argument. Removes the exit search div(and link), and the search results messages,
//if they exist. Calls createExitDiv() and appends the div to the page, allowing the user to exit search mode.
//Creates and displays messages based on the number of search results. If the array is not empty and contains less than
//11 items, calls the showPage() function. If the array contains more than 10 items, resets the page number, and calls
//showPage() and appendPageLinks().
function evaluateSearchMatches(matchedInputArray) {
  removeElements($('.exit-div')[0],
                 $('.no-match')[0],
                 $('.under-eleven')[0],
                 $('.over-ten')[0]);
  const $exitDiv = createExitDiv();
  $($pageDiv).append($exitDiv);
  if(matchedInputArray.length === 0) {
    const $p = createSearchMessage('no-match', 'Sorry, no students found based on the search term "' + $inputValue + '".');
    $($p).insertBefore($exitDiv);
  } else if(matchedInputArray.length < 11) {
      const $p = createSearchMessage('under-eleven',
                                    'The search term "' + $inputValue + '" produced ' + matchedInputArray.length + ' result(s).');
      $($p).insertBefore($studentUl);
      showPage(1, matchedInputArray);
  } else {
      pageNumber = '1';
      const $p = createSearchMessage('over-ten',
                                    'The search term "' + $inputValue + '" produced ' + matchedInputArray.length + ' result(s).');
      $($p).insertBefore($studentUl);
      appendPageLinks(matchedInputArray);
      showPage(1, matchedInputArray);
  }
}

//Creates and returns a div containing a link that appears when a user interacts with the search feature and
//reloads the page if clicked, taking the user out of search mode.
function createExitDiv () {
  const $div = createElement('div', 'class', 'exit-div');
  const $link = createElement('a', 'class', 'exit-link');
  $($link).attr('href', 'index.html');
  $($link).text('Exit Search');
  $($div).append($link);
  return $div;
}

//Takes a class name and textContent as arguments and creates a message for different search results,
//assigning the class and text parameters to the message. Returns the message.
function createSearchMessage (className, textContent) {
  const $p = createElement('p', '', '');
  $($p).attr('class', 'student-item ' + className);
  $($p).text(textContent);
  return $p;
}

//Creates a div to hold the unordered list of links on the page and calls constructPaginationUl() to construct the ul.
//Removes previous page links, if they exist. Appends the ul to the div and the div to the page div.
function appendPageLinks(studentList) {
    const $existingPaginationDiv = $('.pagination');
    const paginationDivElem = $existingPaginationDiv[0];
    const $newPaginationDiv = createElement('div', 'class', 'pagination');
    const $ul = constructPaginationUl(studentList);
      //These two do not work for some reason
    //removeElement(document.getElementsByClassName('.pagination')[0]);
    //removeElement($existingPaginationDiv);
      //These two work.
    removeElement($('.pagination')[0]);
    //removeElement(paginationDivElem);
    $($newPaginationDiv).append($ul);
    $($pageDiv).append($newPaginationDiv);
}

//Takes a student list as an argument. Creates and returns an unordered list to serve as page links. The number of
//links is determined in the for loop by dividing studentList.length by 10. If the text content of any li's
//anchor tag equals the current page number, it is given the class name 'active' to ensure it is appropriately highlighted.
//Adds an event listener to the unordered list and employs bubbling to handle any clicks on the anchor grandchildren.
//The event handler sets pageNumber to the text content of the event target, then calls appendPageLinks() and showPage().
function constructPaginationUl (studentList) {
  const $ul = createElement('ul', '', '');
  for(let i = 0; i < studentList.length/10; i++) {
    const $li = createElement('li', '', '');
    const $a = createElement('a', 'href', '#');
    pageNum = i + 1;
    $($a).text(pageNum);
    if($($a).text() === pageNumber)
      $($a).attr('class', 'active');
    $($li).append($a);
    $($ul).append($li);
  }
  $($ul).on('click', function (event) {
    if(event.target.tagName === 'A') {
      pageNumber = event.target.textContent;
      appendPageLinks(studentList);
      showPage(pageNumber, studentList);
    }
  });
  return $ul;
}

//Removes the element passed as an argument if it exists on the page.
function removeElement (element) {
  if(element != null)
      //Does not work (improperly used)
    //$($pageDiv).remove(element);
      //Thes two work for some reason
    element.remove();
    //pageDivElem.removeChild(element);
}

//Calls removeElement() on any number of elements passed as arguments.
function removeElements (...elements) {
  for(let i = 0; i < elements.length; i++)
    removeElement(elements[i]);
}

//Loops through student links and sets their display property to 'none'.
function hideList (studentList) {
  for(let i = 0; i < studentList.length; i++)
    studentList[i].style.display = 'none';
}
