/* STUDENTS IGNORE THIS FUNCTION
 * All this does is create an initial
 * attendance record if one is not found
 * within localStorage.
 */
(function() {
    if (!localStorage.attendance) {
        console.log('Creating attendance records...');
        function getRandom() {
            return (Math.random() >= 0.5);
        }

      var nameColumns = ['Luke', 'Vader', 'Yoda'],
            attendance = {};

        nameColumns.each(function() {
            var name = this;
            attendance[name] = [];

            for (var i = 0; i <= 11; i++) {
                attendance[name].push(getRandom());
            }
        });

        localStorage.attendance = JSON.stringify(attendance);
    }
}());


/* STUDENT APPLICATION */
$(function() {
  // model
  var attendance;

  // view
  var missedDaysViews = {};
  var tableView = {
    _createStudentView: function () {
      var student = document.createElement('tr');
      student.className = 'student';
      return student;
    },
    _createStudentNameHeaderView: function() {
      var th = document.createElement('th');
      th.className = 'name-col';
      th.innerText = 'Student Name';
      return th;
    },
    _createStudentNameView: function (studentName) {
      var name = document.createElement('td');
      name.className = 'name-col';
      name.innerText = studentName;
      return name;
    },
    _createDayHeaderView: function (day) {
      var th = document.createElement('th');
      th.innerText = day;
      return th;
    },
    _createDayView: function () {
      var td = document.createElement('td');
      td.className = 'attend-col';
      return td;
    },
    _createAttendanceInputView: function (studentName, day, seed) {
      var input = document.createElement('input');
      input.type = 'checkbox';
      input.checked = seed;
      input.addEventListener('click', function() {
	controller.toggleAttendance(studentName, day);
	tableView.render();
      });
      return input;
    },
    _createMissedDaysHeaderView: function () {
      var th = document.createElement('th');
      th.className = 'missed-col';
      th.innerText = 'Days Missed-col';
      return th;
    },
    _createMissedDaysView: function () {
      var missed = document.createElement('td');
      missed.className = 'missed-col';
      missed.innerText = 0;
      missed.update = function (value) {
	missed.innerText = value;
      };
      return missed;
    },
    _initializeHead: function(numberOfDays) {
      var thead = document.getElementsByTagName('thead')[0];
      var tr = document.createElement('tr');
      tr.appendChild(this._createStudentNameHeaderView());
      for (var i = 1; i <= numberOfDays; i++) {
	tr.appendChild(this._createDayHeaderView(i));
      }
      tr.appendChild(this._createMissedDaysHeaderView());
      thead.appendChild(tr);
    },
    _initializeBody: function(attendance) {
      var tbody = document.getElementsByTagName('tbody')[0];

      for (var studentName in attendance) {
	if (attendance.hasOwnProperty(studentName)) {
	  var studentView = this._createStudentView();

	  studentView.appendChild(this._createStudentNameView(studentName));

	  var studentRecord = attendance[studentName];
	  for (var record in studentRecord) {
	    var dayView = this._createDayView();
	    var seedValue = studentRecord[record];
	    var inputView = this._createAttendanceInputView(studentName, record, seedValue);
	    dayView.appendChild(inputView);
	    studentView.appendChild(dayView);
	  }
	  var missedDaysView = this._createMissedDaysView();
	  studentView.appendChild(missedDaysView);
	  missedDaysViews[studentName] = missedDaysView;
	  tbody.appendChild(studentView);
	}
      }
    },
    initialize: function (attendance, numberOfDays) {
      this._initializeHead(numberOfDays);
      this._initializeBody(attendance);
      this.render();
    },
    render: function () {
      var missedDays = controller.calculateMissedDays();
      for (studentName in missedDays) {
	var missedDaysView = missedDaysViews[studentName];
	missedDaysView.update(missedDays[studentName]);
      }
    }
  };

  // octopus
  var controller = {
    initialize: function() {
      attendance = JSON.parse(localStorage.attendance);
      tableView.initialize(attendance, 12);
    },
    toggleAttendance: function(name, day) {
      attendance[name][day] = !attendance[name][day];
      tableView.render();
    },
    calculateMissedDays: function() {
      var missedDays = {};
      for (var studentName in attendance) {
	if (attendance.hasOwnProperty(studentName)) {
	  var studentRecord = attendance[studentName];
	  var missedCount = 0;
	  for (var record in studentRecord) {
	    if (!studentRecord[record]) {
	      missedCount++;
	    }
	  }
	  missedDays[studentName] = missedCount;
	}
      }
      return missedDays;
    }
  };

  controller.initialize();
}());
