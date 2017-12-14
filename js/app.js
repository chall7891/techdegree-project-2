//Declares global variables and assigns their values
const pageDiv = document.getElementsByClassName('page')[0];
const headerDiv = document.getElementsByClassName('page-header')[0];
const studentUl = document.getElementsByClassName('student-list')[0];
const studentListItems = studentUl.children;
let inputValue = '';
let pageNumber = '1';

//Creates and returns an element with an attribute and value as specified in the
//arguments passed to the function.
function createElement(elementType, attribute, attributeValue) {
  const element = document.createElement(elementType);
  element[attribute] = attributeValue;
  return element;
}

//When page loads, showPage(), appendStudentSearchBar() and appendPageLinks()
//are called.
window.onload = function() {
  showPage(1, studentListItems);
  appendStudentSearchBar(studentListItems);
  appendPageLinks(studentListItems);
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
  const div = createElement('div', 'className', 'student-search');
  const input = createElement('input', 'placeholder', 'Search for students...');
  const button = createElement('button', 'textContent', 'Search');
  input.addEventListener('change', function () {
    searchList(studentList);
  });
  button.addEventListener('click', function () {
    searchList(studentList);
  });
  div.appendChild(input);
  div.appendChild(button);
  headerDiv.appendChild(div);
}

//Takes a student list as an argument. Creates an empty array literal for student search matches.
//Assigns the search input value to inputValue. Calls hideList() and removeElement() to clear all student
//links and page numbers. Loops through students and determines if student names or emails contain the
//search input. Adds matching items to the matchedStudents array. Calls evaluateSearchMatches().
function searchList (studentList) {
  const matchedStudents = [];
  inputValue = document.getElementsByTagName('input')[0].value;
  if(inputValue !== '') {
      hideList(studentList);
      removeElement(document.getElementsByClassName('pagination')[0]);
      for(let i = 0; i < studentList.length; i++) {
        const name = studentList[i].getElementsByTagName('h3')[0].textContent;
        const email = studentList[i].getElementsByClassName('email')[0].textContent;
        if(name.includes(inputValue.trim().toLowerCase()) ||
           email.includes(inputValue.trim().toLowerCase()))
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
  removeElements(document.getElementsByClassName('exit-div')[0],
                 document.getElementsByClassName('no-match')[0],
                 document.getElementsByClassName('under-eleven')[0],
                 document.getElementsByClassName('over-ten')[0]);
  const exitDiv = createExitDiv();
  pageDiv.appendChild(exitDiv);
  if(matchedInputArray.length === 0) {
    const p = createSearchMessage('no-match', 'Sorry, no students found based on the search term "' + inputValue + '".');
    pageDiv.insertBefore(p, exitDiv);
  } else if(matchedInputArray.length < 11) {
      const p = createSearchMessage('under-eleven',
                                    'The search term "' + inputValue + '" produced ' + matchedInputArray.length + ' result(s).');
      pageDiv.insertBefore(p, studentUl);
      showPage(1, matchedInputArray);
  } else {
      pageNumber = '1';
      const p = createSearchMessage('over-ten',
                                    'The search term "' + inputValue + '" produced ' + matchedInputArray.length + ' result(s).');
      pageDiv.insertBefore(p, studentUl);
      appendPageLinks(matchedInputArray);
      showPage(1, matchedInputArray);
  }
}

//Creates and returns a div containing a link that appears when a user interacts with the search feature and
//reloads the page if clicked, taking the user out of search mode.
function createExitDiv () {
  const div = createElement('div', 'className', 'exit-div');
  const link = createElement('a', 'className', 'exit-link');
  link.href = 'index.html';
  link.innerHTML = 'Exit Search';
  div.appendChild(link);
  return div;
}

//Takes a class name and textContent as arguments and creates a message for different search results,
//assigning the class and text parameters to the message. Returns the message.
function createSearchMessage (className, textContent) {
  const p = createElement('p', 'textContent', textContent);
  p.className = 'student-item ' + className;
  return p;
}

//Creates a div to hold the unordered list of links on the page and calls constructPaginationUl() to construct the ul.
//Removes previous page links, if they exist. Appends the ul to the div and the div to the page div.
function appendPageLinks(studentList) {
    const paginationDiv = createElement('div', 'className', 'pagination');
    const ul = constructPaginationUl(studentList);
    removeElement(document.getElementsByClassName('pagination')[0]);
    paginationDiv.appendChild(ul);
    pageDiv.appendChild(paginationDiv);
}

//Takes a student list as an argument. Creates and returns an unordered list to serve as page links. The number of
//links is determined in the for loop by dividing studentList.length by 10. If the text content of any li's
//anchor tag equals the current page number, it is given the class name 'active' to ensure it is appropriately highlighted.
//Adds an event listener to the unordered list and employs bubbling to handle any clicks on the anchor grandchildren.
//The event handler sets pageNumber to the text content of the event target, then calls appendPageLinks() and showPage().
function constructPaginationUl (studentList) {
  const ul = document.createElement('ul');
  for(let i = 0; i < studentList.length/10; i++) {
    const li = document.createElement('li');
    const a = createElement('a', 'href', '#');
    a.textContent = i + 1;
    if(a.textContent === pageNumber)
      a.className = 'active';
    li.appendChild(a);
    ul.appendChild(li);
  }
  ul.addEventListener('click', function (event) {
    if(event.target.tagName === 'A') {
      pageNumber = event.target.textContent;
      appendPageLinks(studentList);
      showPage(pageNumber, studentList);
    }
  });
  return ul;
}

//Removes the element passed as an argument if it exists on the page.
function removeElement (element) {
  if(element != null)
    pageDiv.removeChild(element);
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
