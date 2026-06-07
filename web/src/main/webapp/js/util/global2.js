/*
 * Copyright (c) 2015-2016, President and Fellows of Harvard College
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright
 * notice, this list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright
 * notice, this list of conditions and the following disclaimer in the
 * documentation and/or other materials provided with the distribution.
 *
 * 3. The name of the author may not be used to endorse or promote products
 * derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE AUTHOR "AS IS" AND ANY EXPRESS OR IMPLIED
 * WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO
 * EVENT SHALL THE AUTHOR BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED
 * TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
 * PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
 * LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 * NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

var idleTime = 0;
var ONE_MINUTE = 60000;

var timeoutWarningDelta = 5;
var timeoutMinutes = 30;
var idleTimerIncrement = ONE_MINUTE;

var MILITARY_TIME_FORMAT = 'HH:mm';
var MILITARY_TIME_AND_MONTH_DAY_FORMAT = 'HH:mm MM/DD';
var sublocationFilterName;
var app_selectedUser;
var app_selectedResource;
var app_selectedSubject;
var app_selectedStudy;
var app_selectedVisit;
var millisPerDay = (1000 * 60 * 60 * 24); // seconds, minutes, hours, days
var MINS_PER_DAY = 1440;
var MINS_PER_HOUR = 60;
var app_selectedBookedVisit;
var app_selectedBookedResource;
var resourcesSelectOptions;
var app_selectedTemplateResource;
var home;
var roles;
var visitTypes;
var sublocations;
var institutionRoles;
var studyStatuses;
var studyStatusIds;
var resources;
var institutions;
var checkOutReasons;
var cancellationReasons;
var states;
var races;
var ethnicities;
var countries;
var genders;
var credentials;
var departments;
var divisions;
var facultyRanks;
var yesNo = ["Yes", "No"];
var adultPediatric = ["Adult", "Pediatric", "Adult/Pediatric"];
var crcCategories = ["A", "B", "C", "D"];
var roomSelectOptions;
var roleSelectOptions;
var visitTypeSelectOptions;
var sublocationSelectOptions;
var institutionRoleSelectOptions;
var overrideReasonSelectOptions;
var institutionSelectOptions;
var checkOutReasonSelectOptions;
var cancellationReasonSelectOptions;
var stateSelectOptions;
var raceSelectOptions;
var ethnicitySelectOptions;
var genderSelectOptions;
var countrySelectOptions;
var credentialSelectOptions;
var departmentSelectOptions;
var divisionSelectOptions;
var facultyRankSelectOptions;
var studyStatusSelectOptions;
var studyMembersSelectOptions;
var yesNoSelectOptions;
var adultPediatricSelectOptions;
var crcCategorySelectOptions;
var app_idleInterval;
var user;
var calendar_rendered = false;
var USER_STATUS_AUTHORIZED = 1;
var USER_STATUS_NOT_FOUND = 0;
var USER_STATUS_INVALID_PASSWORD = -1;
var USER_STATUS_INACTIVE = -2;
var PREVIOUS_ACCESS_SHOWN = false;
var SUPER_ADMIN = 1;
var RESOURCE_MANAGER = 2;
var SCHEDULER = 3;
var STUDY_STAFF = 4;
var FRONT_DESK = 5;
var GENERAL_VIEW = 6;
var EXERCISE_SUPERVISOR = 7;
var nAgt = navigator.userAgent;
var fullVersion = '' + parseFloat(navigator.appVersion);
var majorVersion = parseInt(navigator.appVersion, 10);
var verOffset, ix;
var view = null;
var initial_load = true;
var currentPage;
var max_results;
var totalData = 0;
var totalPages;
var selectedPage = 1;
var apptInitialDisplay = false;
var enteredPage;
var dayOfWeekString = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
var monthString = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

var commentTypes = {};

var isEpicMode = false;
var studies;
var epicGenders = [{id: "M", name: "Male"}, {id: "F", name: "Female"}, {id: "U", name: "Unreported"}];
var keyCodes = {
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    ENTER: 13,
    BACKSPACE: 8,
    DELETE: 46
};
var nSlashA = 'N/A';
var noSubjectAssigned = 'No Subject Assigned';

var releaseHoldReasonText = 'Administrative Cancel: Operational Cancel (CRC Staff Use Only)';
var releaseHoldReasonId = 0;
var isEditMode;
var comboboxHeight = 31;

// var fullCalendars = [];

var home_calendar;

//keep track of which table is showing on the appointment pop-up
var switchSubjectTableKey = "switchSubjectKey";
var resourceTableKey = "resourceKey";
var tableKey = resourceTableKey;

var ERROR_SSL_FAILS_BUT_SCHED_WORKS = "error 19";
var ERROR_SSL_FAILS_AND_SCHED_FAILS = "error 60";
var ERROR_EMPI_FAILS_BUT_SCHED_WORKS = "error 53";
var ERROR_EMPI_FAILS_AND_SCHED_FAILS = "error 41";
var ERROR_XX = "error XX";

var VisitTypes = {
    OutpatientCRC: 1,
    OutpatientNonCRC: 2,
    OutpatientOffInstitution: 3,
    InpatientCRC: 4,
    InpatientNonCRC: 5,
    InpatientOffInstitution: 6
};

var CALENDAR_VIEW_STORAGE_KEY = "calendarView";

//global abatement, starting an object
var SCHEDULER_CLASS_NAME = {};
SCHEDULER_CLASS_NAME.selectedRow = "selectedRow";

var expandOrCollapseImgUrls = {
    COLLAPSE: 'css/images/sm_circle_minus.png',
    EXPAND: 'css/images/sm_circle_plus.png'
};

var expandOrCollapseImgTitle = {
    COLLAPSE: 'Collapse',
    EXPAND: 'Expand'
};


// LDAP Extension: default active directory domain
var DEFAULT_DOMAIN = 'university';
var CHCO_DOMAIN = 'childrens';

//get static list of comment types
function getCommentTypes() {

    $.getJSON("rest/appointment/getAppointmentCommentTypes", function (data){
        commentTypes = data;
    });
};




function removeEventsWithGivenClassNames(calendar, classNames) {
    calendar.batchRendering(function () {
        var events = calendar.getEvents();
        events.forEach(function (event) {
            classNames.forEach(function (className) {
                if (event.classNames.indexOf(className) > -1) {
                    event.remove();
                }
            })
        })
    });
}

function addCalendarEvents(calendar, events) {
    calendar.batchRendering(function () {
        events.forEach(function (event) {
            calendar.addEvent(event);
        })
    });
}

function resetCalendarEvents(calendar, events) {
    calendar.batchRendering(function () {
        var originalEvents = calendar.getEvents();
        originalEvents.forEach(function (originalEvent) { originalEvent.remove() });
        events.forEach(function (event) {
            calendar.addEvent(AppointmentCalendar.eventTransform(event));
        })
    })
}

function setUpBackToTopButton() {
    $(".mainBody").append('<div id="back-to-top"><a href="#" title="Back to top"><img src="css/images/back_to_top.png">' +
        '</a><div id="back-to-top-text">Back to Top</div></div>');
    if ($('#back-to-top').length) {
        var scrollTrigger = 100, // px
            backToTop = function () {
                var scrollTop = $(window).scrollTop();
                if (scrollTop > scrollTrigger) {
                    $('#back-to-top').addClass('show');
                } else {
                    $('#back-to-top').removeClass('show');
                }
            };
        backToTop();
        $(window).on('scroll', function () {
            backToTop();
        });
        $('#back-to-top').on('click', function (e) {
            e.preventDefault();
            $('html,body').animate({
                scrollTop: 0
            }, 700);
        });
    }
}

function subjectModule() {
    window.location.href = "subject_search.html";
}

function mgmtModule() {
    sessionStorage.setItem("userData", JSON.stringify(user));
    if (PREVIOUS_ACCESS_SHOWN == false && user.previousLoginTime == "") {
        window.location.href = "password_reset.html";
    } else if (user.institutionRole.id == SUPER_ADMIN) {
        window.location.href = "mgmt_screen.html";
    } else {
        window.location.href = "password_reset.html";
    }
}

function appointmentListModule() {
    sessionStorage.setItem("userData", JSON.stringify(user));
    window.location.href = "home.html#homeList";

}

function appointmentBatchModule() {
    sessionStorage.setItem("userData", JSON.stringify(user));
    window.location.href = "appt_batch.html";
}

function homeModule() {
    sessionStorage.setItem("userData", JSON.stringify(user));
    sessionStorage.setItem("is_navigated", false);
    sessionStorage.setItem("eventid", "");
    window.location.href = "home.html";
}

function studyModule() {
    sessionStorage.setItem("userData", JSON.stringify(user));
    window.location.href = "study_screen.html";
}

function resourceModule() {
    sessionStorage.setItem("userData", JSON.stringify(user));
    window.location.href = "resource_screen.html";
}

function reportModule() {
    sessionStorage.setItem("userData", JSON.stringify(user));
    window.location.href = "report.html";
}

function sharedReportModule() {
    sessionStorage.setItem("userData", JSON.stringify(user));
    window.location.href = "shared_report.html";
}


function reportsModule() {
    sessionStorage.setItem("userData", JSON.stringify(user));
    window.location.href = "report_builder.html";
}

function chatbotModule() {
    sessionStorage.setItem("userData", JSON.stringify(user));
    window.location.href = "chatbot.html";
}

function logoutUser() {
    sessionStorage.removeItem("userData");
    sessionStorage.removeItem("eventid");
    sessionStorage.removeItem("selectedSubjectId");
    sessionStorage.removeItem("selectedSubjectByPuid");
    sessionStorage.removeItem("selectedSubjectMrn");
    sessionStorage.removeItem("selectedSubjectInstitution");
    sessionStorage.removeItem(CALENDAR_VIEW_STORAGE_KEY);

    window.location.href = "logout";
}

function restrictAccess() {
    $(document)
        .ajaxError(function (e, xhr, options) {
            if (xhr.status === 403) {
                window.location.href = "access_denied.html";
            }
        });
}

/** sets up lots of things; including:
 * the username at in the welcome Message (at the top right of the page)
 * sets the visibility of the header navigation menu
 **/
function commonData() {
    user = JSON.parse(sessionStorage.getItem("userData"));
    if (user != null) {
        $('#home_userFullName')
            .text(util_buildFullName(user.firstName, user.middleName, user.lastName));
        restrictAccess();
        if (user.previousLoginTime != "") {
            linkRender();
        } else {
            $('.headerNav')
                .css({
                    visibility: "hidden"
                });
            $('.headerLogoWrapper')
                .css({
                    visibility: "visible"
                });
            $('#welcomeMessage')
                .css({
                    display: "block"
                });
            $('#index_helpLinks')
                .css({
                    visibility: "visible"
                });

            $('.homelink')
                .css({
                    visibility: "hidden"
                });
            $('.resourcelink')
                .css({
                    visibility: "hidden"
                });
            $('.studieslink')
                .css({
                    visibility: "hidden"
                });
            $('.subjectslink')
                .css({
                    visibility: "hidden"
                });
            $('.appointmentslink')
                .css({
                    visibility: "hidden"
                });
            $('.managementlink')
                .css({
                    visibility: "hidden"
                });
            $('.reportlink')
                .css({
                    visibility: "hidden"
                });
            $('.reportslink')
                .css({
                    visibility: "hidden"
                });

            $('.sharedReportLink')
                .css({
                    visibility: "hidden"
                });

        }
    }
}

function linkRender() {
    $('.headerNav')
        .css({
            visibility: "visible"
        });
    $('#welcomeMessage')
        .css({
            display: "block"
        });
    $('#index_helpLinks')
        .css({
            visibility: "visible"
        });
    moduleRoles();
}

function app_handleMouseMove() {
    idleTime = 0;
}

function app_runIdleTimer() {
    //Increment the idle time counter every minute.
    app_idleInterval = setInterval(app_timerIncrement, idleTimerIncrement);
    //Zero the idle timer on mouse movement.
    $(this).on("mousemove", function (e) {
            idleTime = 0;
        });
    //Zero the idle timer on data entry.
    $(this).on("keypress", function (e) {
            idleTime = 0;
        });

    setupTextValidification();
}

function setupTextValidification() {
    $('body').on('keydown keyup', '.numbersOnly',       function() { numbersOnlyFn(this); } );
    $('body').on('keydown keyup', '.alphanumericOnly',  function() { alphanumericOnlyFn(this); } );
    $('body').on('keydown keyup', '.numberUpTo999',     function() { numbersOnlyFn(this); numberUpTo999Fn(this); } );
    $('body').on('keydown keyup', '.sizeUpTo256Fn',     function() { sizeUpTo256Fn(this); } );
}

function numbersOnlyFn(elt) {
    if (elt.value != elt.value.replace(/[^0-9]/g, '')) {
        elt.value = elt.value.replace(/[^0-9]/g, '');
    }
}

function alphanumericOnlyFn(elt) {
    if (elt.value != elt.value.replace(/[^a-zA-Z0-9\.]/g, '')) {
        elt.value = elt.value.replace(/[^a-zA-Z0-9\.]/g, '');
    }
}

function numberUpTo999Fn(elt) {
    if (elt.value > 999) {
        elt.value = 999;
    }
}

function sizeUpTo256Fn(elt) {
    elt.value = elt.value.substring(0, 255);
}

function app_timerIncrement() {
    idleTime++;

    pingSession(app_timerIncrementPart2); // never timeout via servlet session
}
function app_timerIncrementPart2() {

    if (idleTime == timeoutMinutes - timeoutWarningDelta) {
        var headerText = "";
        var modal = false;
        DialogsUtil.showMessageDialog('You will be automatically ' +
            'logged out soon unless you do something!', null, "Dismiss", headerText, modal);
    }
    else if (idleTime >= timeoutMinutes) {
        localStorage.setItem("timeout", true);
        logoutUser();
    }
}

function pingSession(continuation) {
    var jsonData = JSON.stringify({
        user: user
    });
    $.post("rest/auth/pingSession", {data: jsonData},
        function () {
            continuation();
        })
     .fail(function(response) {
         console.error(response.responseText);
         continuation();
     });
}

function studyModuleRoles() {
    user = JSON.parse(sessionStorage.getItem("userData"));
    if (user.institutionRole.id == SUPER_ADMIN) {
        $('.study_newStudy')
            .css({
                visibility: "visible"
            });
        $('.study_editStudy')
            .css({
                visibility: "visible"
            });
    } else if (user.institutionRole.id == RESOURCE_MANAGER) {
        $('.study_newStudy')
            .css({
                visibility: "hidden"
            });
        $('.study_editStudy')
            .css({
                visibility: "visible"
            });
    } else if (user.institutionRole.id == SCHEDULER) {
        $('.study_newStudy')
            .css({
                visibility: "hidden"
            });
        $('.study_editStudy')
            .css({
                visibility: "hidden"
            });
    } else if (user.institutionRole.id == STUDY_STAFF) {
        $('.study_newStudy')
            .css({
                visibility: "hidden"
            });
        $('.study_editStudy')
            .css({
                visibility: "hidden"
            });
    } else if (user.institutionRole.id == FRONT_DESK) {
        $('.study_newStudy')
            .css({
                visibility: "hidden"
            });
        $('.study_editStudy')
            .css({
                visibility: "hidden"
            });
    } else if (user.institutionRole.id == GENERAL_VIEW) {
        $('.study_newStudy')
            .css({
                visibility: "hidden"
            });
        $('.study_editStudy')
            .css({
                visibility: "hidden"
            });
    } else if (user.institutionRole.id == EXERCISE_SUPERVISOR) {
        $('.study_newStudy')
            .css({
                visibility: "hidden"
            });
        $('.study_editStudy')
            .css({
                visibility: "hidden"
            });
    }
}

    var UserRoleUtil = function () {};

UserRoleUtil.isGeneralFrontOrStaff = function(user) {
    var roleId = user.institutionRole.id;
    return (    roleId === GENERAL_VIEW
    || roleId === FRONT_DESK
    || roleId === STUDY_STAFF);
};
UserRoleUtil.isAdminUser = function(user) {
    var roleId = user.institutionRole.id;
    return (roleId === SUPER_ADMIN);
};
UserRoleUtil.isStaff = function(user) {
    var roleId = user.institutionRole.id;
    return (roleId === STUDY_STAFF);
};

UserRoleUtil.isGeneralView = function(user) {
    user = (user || UserRoleUtil.getUser());

    var roleId = user.institutionRole.id;
    return (    roleId === GENERAL_VIEW);
};

UserRoleUtil.isCrcStaff = function(user) {
    var roleId = user.institutionRole.id;
    return (
        roleId == SUPER_ADMIN ||
        roleId == RESOURCE_MANAGER ||
        roleId == SCHEDULER
    );
};

UserRoleUtil.isFrontDesk = function(user) {
    var roleId = user.institutionRole.id;
    return (
        roleId == FRONT_DESK
    );
};


    UserRoleUtil.isExerciseSupervisor = function(user) {
        var roleId = user.institutionRole.id;
        return (
            roleId == EXERCISE_SUPERVISOR
        );
    };

UserRoleUtil.isResourceManagerOrSuperAdmin = function(user){
    var roleId = user.institutionRole.id;
    return (
        roleId == SUPER_ADMIN ||
        roleId == RESOURCE_MANAGER
    );
};

UserRoleUtil.getUser = function() {
    return JSON.parse(sessionStorage.getItem("userData"));
};
UserRoleUtil.userIsCrcStaff = function() {
    var roleId = UserRoleUtil.getUser().institutionRole.id;
    return (
        roleId == SUPER_ADMIN ||
        roleId == RESOURCE_MANAGER ||
        roleId == SCHEDULER
    );
};
UserRoleUtil.userIsSuperAdminOrResourceManager = function() {
    var roleId = UserRoleUtil.getUser().institutionRole.id;

    return (roleId === SUPER_ADMIN || roleId === RESOURCE_MANAGER);
};
UserRoleUtil.userIsScheduler = function() {
    var roleId = UserRoleUtil.getUser().institutionRole.id;

    return (roleId === SCHEDULER);
};
UserRoleUtil.userIsSuperAdmin = function() {
    var roleId = UserRoleUtil.getUser().institutionRole.id;

    return (roleId === SUPER_ADMIN);
};

UserRoleUtil.userIsFrontDesk = function() {
    var roleId = UserRoleUtil.getUser().institutionRole.id;

    return (roleId === FRONT_DESK);
};


UserRoleUtil.userIsExerciseSupervisor = function() {
    var roleId = UserRoleUtil.getUser().institutionRole.id;

    return (roleId === EXERCISE_SUPERVISOR);
};

function moduleRoles() {
    user = JSON.parse(sessionStorage.getItem("userData"));
    if (user.institutionRole.id == SUPER_ADMIN) {
        $('.homelink')
            .css({
                display: "inline-block"
            });
        $('.resourcelink')
            .css({
                display: "inline-block"
            });
        $('.studieslink')
            .css({
                display: "inline-block"
            });
        $('.subjectslink')
            .css({
                display: "inline-block"
            });
        $('.appointmentslink')
            .css({
                display: "inline-block"
            });
        $('.managementlink')
            .css({
                display: "inline-block"
            });
        $('.reportlink')
            .css({
                display: "inline-block"
            });
        $('.reportslink')
            .css({
                display: "inline-block"
            });

        $('.sharedReportLink')
            .css({
                display: "inline-block"
            });
    } else if (user.institutionRole.id == RESOURCE_MANAGER) {
        $('.homelink')
            .css({
                display: "inline-block"
            });
        $('.resourcelink')
            .css({
                display: "inline-block"
            });
        $('.studieslink')
            .css({
                display: "inline-block"
            });
        $('.subjectslink')
            .css({
                display: "inline-block"
            });
        $('.appointmentslink')
            .css({
                display: "inline-block"
            });
        $('.managementlink')
            .css({
                display: "inline-block"
            });
        $('.reportlink')
            .css({
                display: "inline-block"
            });
        $('.reportslink')
            .css({
                display: "none"
            });
        $('.sharedReportLink')
            .css({
                display: "inline-block"
            });

    } else if (user.institutionRole.id == SCHEDULER) {
        $('.homelink')
            .css({
                display: "inline-block"
            });
        $('.resourcelink')
            .css({
                display: "inline-block"
            });
        $('.studieslink')
            .css({
                display: "inline-block"
            });
        $('.subjectslink')
            .css({
                display: "inline-block"
            });
        $('.appointmentslink')
            .css({
                display: "inline-block"
            });
        $('.managementlink')
            .css({
                display: "inline-block"
            });
        $('.reportlink')
            .css({
                display: "inline-block"
            });
        $('.reportslink')
            .css({
                display: "none"
            });

        $('.sharedReportLink')
            .css({
                display: "none"
            });

    } else if (user.institutionRole.id == STUDY_STAFF) {
        $('.homelink')
            .css({
                display: "inline-block"
            });
        $('.resourcelink')
            .css({
                display: "inline-block"
            });
        $('.studieslink')
            .css({
                display: "inline-block"
            });
        $('.subjectslink')
            .css({
                display: "inline-block"
            });
        $('.appointmentslink')
            .css({
                display: "inline-block"
            });
        $('.managementlink')
            .css({
                display: "inline-block"
            });
        $('.reportlink')
            .css({
                display: "none"
            });
        $('.reportslink')
            .css({
                display: "none"
            });
        $('.sharedReportLink')
            .css({
                display: "none"
            });


    } else if (user.institutionRole.id == FRONT_DESK) {
        $('.homelink')
            .css({
                display: "inline-block"
            });
        $('.resourcelink')
            .css({
                display: "inline-block"
            });
        $('.studieslink')
            .css({
                display: "inline-block"
            });
        $('.subjectslink')
            .css({
                display: "inline-block"
            });
        $('.appointmentslink')
            .css({
                display: "inline-block"
            });
        $('.managementlink')
            .css({
                display: "inline-block"
            });
        $('.reportlink')
            .css({
                display: "inline-block"
            });
        $('.reportslink')
            .css({
                display: "none"
            });

        $('.sharedReportLink')
            .css({
                display: "none"
            });


    } else if (user.institutionRole.id == GENERAL_VIEW) {
        $('.homelink')
            .css({
                display: "inline-block"
            });
        $('.resourcelink')
            .css({
                display: "inline-block"
            });
        $('.studieslink')
            .css({
                display: "none"
            });
        $('.subjectslink')
            .css({
                display: "none"
            });
        $('.appointmentslink')
            .css({
                display: "inline-block"
            });
        $('.managementlink')
            .css({
                display: "inline-block"
            });
        $('.reportlink')
            .css({
                display: "inline-block"
            });
        $('.reportslink')
            .css({
                display: "none"
            });

        $('.sharedReportLink')
            .css({
                display: "none"
            });


    }

    else if (user.institutionRole.id == EXERCISE_SUPERVISOR) {
        $('.homelink')
            .css({
                display: "inline-block"
            });
        $('.resourcelink')
            .css({
                display: "inline-block"
            });
        $('.studieslink')
            .css({
                display: "inline-block"
            });
        $('.subjectslink')
            .css({
                display: "inline-block"
            });
        $('.appointmentslink')
            .css({
                display: "inline-block"
            });
        $('.managementlink')
            .css({
                display: "inline-block"
            });
        $('.reportlink')
            .css({
                display: "inline-block"
            });
        $('.reportslink')
            .css({
                display: "none"
            });

        $('.sharedReportLink')
            .css({
                display: "inline-block"
            });

    }


}

function getBrowserVersion() {
    if ((verOffset = nAgt.indexOf("MSIE")) != -1) {
        fullVersion = nAgt.substring(verOffset + 5);
    }
    // trim the fullVersion string at semicolon/space if present
    if ((ix = fullVersion.indexOf(";")) != -1) fullVersion = fullVersion.substring(0, ix);
    if ((ix = fullVersion.indexOf(" ")) != -1) fullVersion = fullVersion.substring(0, ix);
    majorVersion = parseInt('' + fullVersion, 10);
    if (isNaN(majorVersion)) {
        fullVersion = '' + parseFloat(navigator.appVersion);
        majorVersion = parseInt(navigator.appVersion, 10);
    }
}

function booleanToStatusValue(value) {
    if (value) {
        return "Active";
    } else if (value === undefined) {
        return "";
    }
    return "Not Active";
}

//expecting value to be a string or an int
function showValue(value) {
    if (value) {
        return value;
    } else {
        return "";
    }
}

function yesNoValue(value) {
    if (value !== undefined) {
        return (value === true ? "Yes" : "No");
    } else {
        return "";
    }
}

function buildFullName(obj) {
    if (obj) {
        return util_buildFullName(showValue(obj.firstName),
            showValue(obj.middleName),
            showValue(obj.lastName));
    } else {
        return "";
    }
}

function removeAdditionalComma(value) {
    if (value != undefined && value != null) {
        return value.replace(/,/g, "");
    }
}

function validatePageInput(object) {
    page = parseInt(object.value);
    if (isNaN(page) || page == 'undefined') {
        util_showMainMessage("Please enter a valid page number.");
        object.value = 1;
    }
    else if (page > totalPages || page < 1) {
        util_showMainMessage("Entered value outside the page range. Please enter a valid page.");
        object.value = currentPage;
    }
    enteredPage = parseInt(object.value);
}

function setupTable(outHtml, tableElement, currentPage, totalData, filterElement, loadFnName) {

    tableElement.html(outHtml);
    $("#selectRecords > [value='" + max_results + "']").attr("selected", "true");

    var remainder = totalData % max_results;

    totalPages = Math.floor(totalData / max_results);

    // very first page has floor of 0
    if (remainder > 0) {
        totalPages++;
    }
    // if still 0, then there were no results, but still it's page 1
    if (totalPages === 0) {
        totalPages++;
    }

    createPaginationLinks(currentPage, totalPages, loadFnName);

    if (filterElement) {
        filterElement.val('');
    }
}

function createPaginationLinks(currentPage, totalPages, loadFnName) {

    var before_links = '';

    var after_links = makeAfterLinks();
    var afterArrows = makeAfterArrows();
    var beforeArrows = makeBeforeArrows();

    if (totalPages == 0 || totalPages == 1) {
        // Use the empty default strings...
    } else if (currentPage == 1) {
        after_links += afterArrows;
    } else if (currentPage != 1 && currentPage == totalPages) {
        before_links = beforeArrows;
    } else {
        before_links = beforeArrows;
        after_links += afterArrows;
    }

    //create the pagination and insert it into the page
    //if there is more than one table on the page, this could break; because of
    //how it inserts it. TBD TODO FIX  THIS
    buildPagination(currentPage, before_links, after_links, loadFnName);

    function makeAfterLinks() {
        var after_links = "<input type='button' value='Go' " +
            "class='formButton goButton' onclick='gotoPage(";

        if (loadFnName) {
            after_links += "undefined, " + loadFnName;
        }
        after_links += ");'/> ";
        return after_links;
    }

    function makeAfterArrows() {
        var rightArrow = "css/images/gantt/forward_arrow.png";
        var rightDoubleArrow = "css/images/gantt/allthewayforward_arrow.png";

        var afterArrows = "<img src='" + rightArrow + "' onclick='gotoNextPage(" + loadFnName + ");' style='vertical-align: middle;'/> " +
            " <img src='" + rightDoubleArrow + "' onclick='gotoLastPage(" + loadFnName + ");' style='vertical-align: middle;'/> ";
        return afterArrows;
    }

    function makeBeforeArrows() {
        var leftArrow = "css/images/gantt/back_arrow.png";
        var leftDoubleArrow = "css/images/gantt/allthewayback_arrow.png";

        var beforeArrows = "<img src='" + leftDoubleArrow + "' onclick='gotoFirstPage(" + loadFnName + ");' style='vertical-align: middle;'/> " +
            " <img src='" + leftArrow + "' onclick='gotoPreviousPage(" + loadFnName + ");' style='vertical-align: middle;'/> ";
        return beforeArrows;
    }
}

function createPageDropDownList(loadFnName) {
    var loadFnNamePart = makeExtraArgStringIfPresent(loadFnName);
    var select_box = "Display Records: <select id='selectRecords' name='selectRecords' onchange='showSelected(this.value" + loadFnNamePart +");'> " +
        " <option value='5'>5</option> " + " <option value='10'>10</option> " +
        " <option value='25'>25</option> " + " <option value='50'>50</option> " +
        " <option value='100'>100</option> " + " </select> ";
    $('.selectBox')
        .html(select_box);
    $('#selectBox')
        .html(select_box);
    if (max_results) {
        $("#selectRecords > [value='" + max_results + "']").attr("selected", "true");
    }

}

function makeExtraArgStringIfPresent(fnName) {
    return fnName? "," + fnName : "";
}


function showSelected(value, loadFn) {
    max_results = value;
    currentPage = 1;
    enteredPage = undefined;
    apptInitialDisplay = initial_load;
    useLoadFnIfPresent(loadFn);
}

function loadDataForRespectivePage(elementId) {
    // TODO-XH : clean up the conditions below, and also the way that
    // location is set for each feature
   if (/\/home.html#ScheduledVisit$/.test(window.location.href) ||
        /\/home.html#ScheduledVisit$/.test(window.location.href)) {
        if (tableKey === switchSubjectTableKey) {
            // changing subject on home or appt calendar page
            loadSwitchSubjectData(currentPage);
        } else if (tableKey === resourceTableKey) {
            loadBookedResourcesData(currentPage, eventid);
        }
    } else if (elementId) {
        loadApptSubjectDataIntoSpecificElement(currentPage, $('#' + elementId));
        return;
    }

    if (/\/resource_screen.html$/.test(window.location.href)) {
        loadResourcesData(currentPage);
    }

    if (/\/home.html#TemplateApprovalList$/.test(window.location.href)) {
        VisitTemplatesNeedingApproval.loadTemplatesToApproveData(currentPage);
    }
    if (shouldLoadResourceData()) {
        loadBookedResourcesData(currentPage, eventid);
    }
}

function shouldLoadResourceData(url) {
    if (!url) {
        url = window.location.href;
    }
    return (/\/home.html$/.test(url)) ||
        (/\/home.html#$/.test(url)) ||
        (/\/appt_batch.html$/.test(url)) ||
        (/\/home.html#$/.test(url)) ||
        (/\/home.html#homeCalendar$/.test(url));
}

function resetUI() {
    max_results = undefined;
    sortBy = undefined;
    currentPage = 1;
    orderBy = 'ASC';
}

/**
 * referenced in HTML file
 */
function sortingFunction(sort_by, elementId) {
    basicSortBy(sort_by);
    loadDataForRespectivePage(elementId);
}

function basicSortBy(sort_by) {
    sortBy = sort_by;
    if (orderBy === "ASC") {
        orderBy = "DESC";
    } else {
        orderBy = "ASC";
    }
    currentPage = 1;
    apptInitialDisplay = false;
}


function gotoFirstPage(loadFn) {
    currentPage = $('.input_page')
        .val();
    if (currentPage == 1) {
        util_showMainMessage("You are already on the first page.");
        return;
    }
    currentPage = 1;
    apptInitialDisplay = false;
    useLoadFnIfPresent(loadFn);
}

function gotoPreviousPage(loadFn) {
    currentPage = $('.input_page')
        .val();
    if (currentPage == 1) {
        util_showMainMessage("You are already on the first page..There is no previous page.");
        return;
    }
    currentPage = parseInt(currentPage) - 1;
    apptInitialDisplay = false;
    useLoadFnIfPresent(loadFn);
}

function useLoadFnIfPresent(loadFn) {
    if (loadFn) {
        loadFn();
    } else {
        loadDataForRespectivePage(null);
    }
}
function gotoLastPage(loadFn) {
    currentPage = $('.input_page')
        .val();
    if (currentPage == totalPages) {
        util_showMainMessage("You are already on the last page.");
        return;
    }
    currentPage = totalPages;
    apptInitialDisplay = false;
    useLoadFnIfPresent(loadFn);
}

function gotoNextPage(loadFn) {
    currentPage = $('.input_page')
        .val();
    if (currentPage == totalPages) {
        util_showMainMessage("You are already on the last page. There is no next page.");
        return;
    }
    if (currentPage > totalPages) {
        util_showMainMessage("Not a valid Page number!! Please enter a valid page number.");
        return;
    }
    currentPage = parseInt(currentPage) + 1;
    apptInitialDisplay = false;
    useLoadFnIfPresent(loadFn);
}

function filterEnterKeySubmit(myfield, e, loadFn) {
    var keycode;

    if (window.event) {
        keycode = window.event.keyCode;
    } else if (e) {
        keycode = e.which;
    } else {
        return true;
    }

    if (keycode === keyCodes.ENTER) {
        var studyFilterString = $.trim($('#appt_studyFilterText')
            .val());
        var visitFilterString = $.trim($('#appt_visitFilterText')
            .val());
        var subjectFilterString = $.trim($('#appt_subjectFilterText')
            .val());
        var calendarFilterString = $.trim($('#appointmentfilterString')
            .val());
        var switchSubjectFilterString = $.trim($('#switchSubject_subjectFilterText')
            .val());
        var finalString = $.trim($('#filters_string')
            .val());
        if (finalString == '') {
            if (studyFilterString != '') {
                finalString = studyFilterString;
                sessionStorage.setItem("filteredString", studyFilterString);
            } else if (visitFilterString != '') {
                finalString = visitFilterString;
                sessionStorage.setItem("filteredString", visitFilterString);
            } else if (subjectFilterString != '') {
                finalString = subjectFilterString;
                sessionStorage.setItem("filteredString", subjectFilterString);
            } else if (switchSubjectFilterString != '') {
                finalString = switchSubjectFilterString;
                sessionStorage.setItem("filteredString", switchSubjectFilterString);
            } else if (calendarFilterString != '') {
                filterCalendarViewClick();
                return false;
            }
        }
        if (finalString == '') {
            util_showMainMessage("Please enter a filter value.");
            return false;
        } else {
            currentPage = 1;
            $('#appt_studyFilterButton')
                .attr("value", "Reset");
            $('#appt_visitFilterButton')
                .attr("value", "Reset");
            $('#appt_subjectFilterButton')
                .attr("value", "Reset");
            $('#switchSubject_subjectFilterButton')
                .attr("value", "Reset");
            apptInitialDisplay = true;
            useLoadFnIfPresent(loadFn);
            return false;
        }
    }
    return true;
}

function switchSubjectfilterKeypressHandler(myfield, e) {
    var keycode;

    if (window.event) {
        keycode = window.event.keyCode;
    } else if (e) {
        keycode = e.which;
    } else {
        return true;
    }

    if (keycode === keyCodes.ENTER) {
        var switchSubjectFilterString = $.trim($('#switchSubject_subjectFilterText').val());
        var finalString = $.trim($('#filters_string').val());
        if (finalString == '') {
            if (switchSubjectFilterString != '') {
                finalString = switchSubjectFilterString;
                sessionStorage.setItem("filteredString", switchSubjectFilterString);
            }
        }
        if (finalString == '') {
            util_showMainMessage("Please enter a filter value.");
            return false;
        } else {
            currentPage = 1;
            $('#switchSubject_subjectFilterButton').attr("value", "Reset");
            apptInitialDisplay = true;
            ApptSubjectsTable.currentTable.filterString = finalString;
            ApptSubjectsTable.currentTable.setCurrentPage(currentPage);
            ApptSubjectsTable.currentTable.reloadFn();
            return false;
        }
    }
    return true;
}

function paginationEnterKeySubmit(myfield, e, loadFn) {
    var keycode;
    if (window.event){
        keycode = window.event.keyCode;
    } else if (e) {
        keycode = e.which;
    } else  {
        return true;
    }
    if (keycode === keyCodes.ENTER) {
        gotoPage(myfield.value,loadFn);
        return false;
    }

    return true;
}

function gotoPage(page, loadFn) {
    if (page != undefined && enteredPage != undefined) {
        currentPage = page;
    } else if (page == undefined) {
        currentPage = enteredPage;
        enteredPage = undefined;
    }

    if (currentPage > totalPages) {
        util_showMainMessage("Not a valid Page number!! Please enter a valid page number.");
        return;
    }

    currentPage = parseInt(currentPage);
    apptInitialDisplay = false;
    useLoadFnIfPresent(loadFn);
}

function buildPagination(currentPage, before_links, after_links, loadFnName) {
    if (currentPage == null || currentPage == "null") {
        currentPage = 1;
    }

    var loadFnPart = makeExtraArgStringIfPresent(loadFnName);

    var pagination = "<div id='pagination'> " + before_links + " Page " +
        " <input type='text' class='input_page' " +
        "onkeypress='return paginationEnterKeySubmit(this,event" + loadFnPart + ");' " +
        "onchange='validatePageInput(this);' value='"
        + currentPage + "'/> " +
        " of " + totalPages + after_links + " </div>";
    $('.pagination_block')
        .html(pagination);
    $('#pagination_block')
        .html(pagination);
}

function getStudySelectedRowId(id) {
    var tdClass;
    if (appt_selectedStudy == null) {
        appt_selectedStudy = id;
        selectedStudy = id;
    } else if (appt_selectedStudy == id) {
        appt_selectedStudy = id;
        selectedStudy = id;
    } else if (appt_selectedStudy != id) {
        tdClass = ".selectClass" + appt_selectedStudy;
        unSelectRow(tdClass);
        appt_selectedStudy = id;
        selectedStudy = id;
    }
    selectRow(".selectClass" + appt_selectedStudy);
}

function getVisitSelectedRowId(parentElementId, id, visitTypeId, visitDuration, relativeTime) {
    var tdClass;
    if (appt_selectedVisit == null) {
        appt_selectedVisit = id;
        selectedVisit = id;
    } else if (appt_selectedVisit == id) {
        appt_selectedVisit = id;
        selectedVisit = id;
    } else if (appt_selectedVisit != id) {
        tdClass = "#" + parentElementId + " .selectClass" + appt_selectedVisit;
        unSelectRow(tdClass);
        appt_selectedVisit = id;
        selectedVisit = id;
    }
    tdClass = "#" + parentElementId + " .selectClass" + appt_selectedVisit;
    selectRow(tdClass)
    appt_selectedVisitName = $(tdClass).text();

    appt_selectedVisitType = visitTypeId;
    appt_selectedVisitDuration = visitDuration;
    appt_selectedVisitRelative = relativeTime;

    $('.dialog_study_visit').text(appt_selectedVisitName);
}

function resetSelectedSubjectAndChoiceVisibility(doTheCheckbox, chooseSubjectElementHash, subjectNaCheckboxElement) {
    resetSelectedSubject(doTheCheckbox, chooseSubjectElementHash, subjectNaCheckboxElement);

    if (!doTheCheckbox) {
        adjustSubjectChoiceVisibility(subjectNaCheckboxElement, chooseSubjectElementHash);
    }

}

function resetSelectedSubject(doTheCheckbox, chooseSubjectElementHash, subjectNaCheckboxElement) {
    appt_selectedSubjectMrnId = null;
    selectedStudySubject = null;
    appt_selectedSubjectName = null;
    appt_selectedSubjectMrn = null;
    appt_selectedSubjectGender = null;
    $('.dialog_study_subject').text(noSubjectAssigned)
    $('.dialog_study_subject_mrn').text(nSlashA);
    $('.dialog_study_subject_gender').text(nSlashA);

    if (doTheCheckbox) {
        if (subjectNaCheckboxElement != null) {
            subjectNaCheckboxElement.checked = false;
        }

        adjustSubjectChoiceVisibility(subjectNaCheckboxElement, chooseSubjectElementHash)
    }
}

//sets globals
function getSubjectSelectedRowId(parentElementId, id, fullName) {
    var tdClass;
    if (appt_selectedSubjectMrnId == null) {
        appt_selectedSubjectMrnId = id;
        selectedStudySubject = id;
    } else if (appt_selectedSubjectMrnId == id) {
        appt_selectedSubjectMrnId = id;
        selectedStudySubject = id;
    } else if (appt_selectedSubjectMrnId != id) {
        tdClass = "#" + parentElementId + " .selectClass" + appt_selectedSubjectMrnId;
        unSelectRow(tdClass);
        appt_selectedSubjectMrnId = id;
        selectedStudySubject = id;
    }
    tdClass = "#" + parentElementId + " .selectClass" + appt_selectedSubjectMrnId;

    selectRow(tdClass);

    if (fullName) {
        appt_selectedSubjectName = fullName;
    } else {
        appt_selectedSubjectName = $(tdClass + ':nth-child(2)')
                .text() + ' ' + $(tdClass + ':nth-child(1)')
                .text();
    }
    //this one is safe b/c the other tables in the make appt wizard do not have a
    //third column
    appt_selectedMrn = $(tdClass + ':nth-child(3)').text();
    appt_selectedSubjectMrn = appt_selectedMrn;

    appt_selectedSubjectGender = Appointments.studySubjectGender[appt_selectedSubjectMrnId];

    $('.dialog_study_subject').text(appt_selectedSubjectName);
    $('.dialog_study_subject_mrn').text(appt_selectedSubjectMrn);
    $('.dialog_study_subject_gender').text(appt_selectedSubjectGender);
}

function selectSubject(tableElementId, rowElementId, subjectMrnId, mrn, fullName, gender) {

    // set globals that drive the UI state
    appt_selectedSubjectMrnId = subjectMrnId;
    selectedStudySubject = subjectMrnId;
    appt_selectedSubjectName = fullName;
    appt_selectedMrn = mrn;
    appt_selectedSubjectMrn = mrn;
    appt_selectedSubjectGender = gender;

    // highlight the newly-selected row
    $('#' + tableElementId + ' tr.' + SCHEDULER_CLASS_NAME.selectedRow).removeClass(SCHEDULER_CLASS_NAME.selectedRow);
    $('#' + rowElementId).addClass(SCHEDULER_CLASS_NAME.selectedRow);

    // update UI state
    $('.dialog_study_subject').text(appt_selectedSubjectName);
    $('.dialog_study_subject_mrn').text(appt_selectedSubjectMrn);
    $('.dialog_study_subject_gender').text(appt_selectedSubjectGender);

}

function dialogCloseFunction() {
    $("#appt_startDate").datepicker("destroy");
    $("#appt_endDate").datepicker("destroy");

    window.location.hash = '';
    sessionStorage.setItem("is_navigated", false);
    sessionStorage.setItem("eventid", "");
}

function preventDefaultAction(event) {
    if (event.stopPropagation) {
        // for proper browsers ...
        event.stopPropagation();
    } else if (window.event) {
        // internet exploder uses cancelBubble ...
        window.event.cancelBubble = true;
    } else if (event.preventDefault) {
        event.preventDefault(event);
    }
}


function isNotStudyStaff() {
    return user.institutionRole.id != STUDY_STAFF;
}

function isStudyStaff() {
    return user.institutionRole.id === STUDY_STAFF;
}

function loadAndRenderTemplate(templateElement, templateData) {
    var renderedTemplate = $.templates(templateElement);
    return renderedTemplate.render(templateData);
}
//for erasing license blocks that are included in html snippets (files that are loaded into other files)
function eraseLicense() {
    $('.license_erase').html("");
}

function loadAndEraseLicense($element, toload, callback) {
    $element.load(toload, function () {
        eraseLicense();
        if (callback) {
            callback();
        }
    });
}


//common template initialization code:
function initFooter() {

    loadAndEraseLicense($('#main_dialog_wrapper'), "main_dialog_wrapper.html", function() {
        $.get("common_dialogs.html", function (content) {
            $('#main_dialog_wrapper').after(content);
            eraseLicense();
            checkLogin();
        });
    });

    loadAndEraseLicense($('.footer'), "footer.html", setVersionData);
    setUpBackToTopButton();
}


function loadMetaHeaders() {
    $.get("meta_headers.html", function (content) {
        $("head").prepend(content);
        eraseLicense();
    });
}

//A function to adjust the appearance of scrollbars on the subject listing
function hideOrShowScrollbars(element, maxHeight) {
    if (element == null || maxHeight == null || maxHeight < 1) {
        return;
    }

    //check if scrollbars should be displayed
    var windowHeight = $(window).height();
    var elementTop = element.offset().top;
    var elementHeight = element.height();
    if (elementHeight > windowHeight - elementTop) {
        //show scrollbars by setting a max height
        element.css({"max-height": maxHeight});
    }
    else {
        //hide scrollbars
        element.css({"max-height": "none"});
    }
}

function getSubjectStaticLists(successCallback) {
    $.get("rest/app/getStaticLists", {}, function (data) {

        var parsedData = JSON.parse(data);

        states = parsedData.states;
        races = parsedData.races;
        ethnicities = parsedData.ethnicities;
        countries = parsedData.countries;
        genders = parsedData.genders;

        stateSelectOptions = buildSelectOptions(states, 'name', 'choose');
        raceSelectOptions = buildSelectOptions(races, 'name', 'choose');
        genderSelectOptions = buildSelectOptions(genders, 'name', 'Gender (Optional)');
        ethnicitySelectOptions = buildSelectOptions(ethnicities, 'name', 'choose');
        countrySelectOptions = buildSelectOptions(countries, 'name', 'choose');

        if (typeof successCallback == 'function') {
            successCallback();
        }
    });
}

function getNonClosedStudiesList(successCallback) {

    $.getJSON("rest/study/getNonClosedStudiesList", function (data) {
        studies = data.studys;

        studies.forEach(function (study) {
            study.truncatedLabel = study.localId + ' - ' + study.name.substring(0, 50);
        });

        if (typeof successCallback == 'function') {
            successCallback();
        }
    });

}

/*
 * mrnField - the element to convert to a combobox (required)
 * mrnInfoList - list of mrnInfo objects (required)
 * searchMrn - default value for the drop down
 * options - options for the combobox widget
 */
function renderSubjectMrnField(mrnField, mrnInfoList, searchMrn, options) {

    var mrnInfoListAvailable = [];
    var mrnInfoListNotAvailable = [];
    var searchMrnText = '';
    var searchMrnAvailable = false;

    $.each(mrnInfoList, function (index, mrnInfo) {
        var group = "Unavailable";
        if (mrnInfo.status == "A" || MiscUtil.isUndefinedOrNull(mrnInfo.status)) {
            group = "Available";
        }

        var mrnInfoItem;
        if (mrnInfo.institution !== undefined && isEpicMode) {
            mrnInfoItem = {
                text: mrnInfo.value + " " + mrnInfo.institution,
                value: mrnInfo.value,
                institution: mrnInfo.institution,
                status: mrnInfo.status,
                group: group
            };
        }
        else {
            mrnInfoItem = {
                value: mrnInfo.value,
                text: mrnInfo.value,
                group: group,
                status: mrnInfo.status
            };
        }

        //keep track of whether the default value for the mrn is available
        if (searchMrn != null && searchMrn.length > 0 && mrnInfo.value == searchMrn.toUpperCase()) {
            if (group == "Available") {
                searchMrnAvailable = true;
            }

            searchMrnText = mrnInfoItem.text;
        }

        if (group === "Available") {
            mrnInfoListAvailable.push(mrnInfoItem);
        }
        else {
            mrnInfoItem['disabled'] = true;
            mrnInfoListNotAvailable.push(mrnInfoItem);
        }
    });

    if (options == null) {
        options = {};
    }

    var prompt = options.prompt;
    //combine the mrn available and unavailable lists
    //this is done because mrns with the same availability must be grouped together
    var mrnInfoList = mrnInfoListAvailable.concat(mrnInfoListNotAvailable);
    //only display a drop down if there are 2 or more MRNs
    var defaultValue = "";
    if (searchMrn != null && searchMrn.length > 0) {
        if (searchMrnAvailable) {
            //select the MRN that the search was performed with
            defaultValue = searchMrn.toUpperCase();
        } else {
            //do not select the search mrn since it is not available
            prompt = searchMrnText;
        }
    }

    if (mrnField.data("combobox")) {
        //workaround to prevent the combobox destroy function
        //from removing the original element
        var mrnFieldParent = mrnField.parent();
        var closestSibling = mrnField.prev();

        var mrnFieldCopy = mrnField.detach();
        mrnField.combobox("destroy");
        mrnField = mrnFieldCopy;

        if (closestSibling.length == 0) {
            //if no sibling before then this is the first element of its parent
            //so just prepend it
            mrnFieldParent.prepend(mrnField);
        } else {
            mrnField.insertAfter(closestSibling);
        }
    }

    if (defaultValue.length > 0) {
        mrnField.data("defaultMrn", defaultValue);
    }

    mrnField.css({display: 'inline-block'});
    WidgetUtil.createComboBox(mrnField,
        {
            valueField: 'value',
            textField: 'text',
            groupField: 'group',
            prompt: prompt,
            value: defaultValue,
            delay: 0,
            width: options.width,
            height: options.height,
            onChange: options.onChange,
            onBeforeLoad: options.onBeforeLoad,
            onSelect: options.onSelect,
            formatter: function (row) {
                //add the disabled
                if (row.group == "Unavailable") {
                    return "<ul class='comboboxListItem comboboxListItemDisabled'><li><span>" + row.text + "</span></li></ul>";
                } else {
                    return "<ul class='comboboxListItem'><li><span>" + row.text + "</span></li></ul>";
                }
            },
            groupFormatter: function (group) {
                return "<span class='mrnListGroup'>" + group + "</span>";
            }
        });
    mrnField.combobox("loadData", mrnInfoList);

    $(mrnField.combobox("textbox")[0]).click(function (event) {
        //show the mrn drop down as soon as the textbox is clicked
        mrnField.combobox("showPanel");
    });

}

function isValidMrn(mrn) {

    return mrn !== nSlashA;

}

//check that the value entered is one of the values in the combobox
function validComboboxValue(element) {
    var textField = $(element).combobox('options').textField;

    var textLowerCase = $(element).combobox("getText").trim().toLowerCase();
    var rows = $(element).combobox('getData');
    for (var i = 0; i < rows.length; i++) {
        if (rows[i][textField].trim().toLowerCase() == textLowerCase) {
            return true;
        }
    }

    return false;
}

function lookUpIdByName(list, nameToMatch) {
    for (var i = 0; i < list.length; i++) {
        if (list[i].name.toLowerCase() == nameToMatch.toLowerCase()) {
            return list[i].id;
        }
    }

    return null;
}

function lookUpNameById(list, idToMatch) {
    for (var i = 0; i < list.length; i++) {
        if (list[i].id == idToMatch) {
            return list[i].name;
        }
    }

    return null;
}

//check that the value entered is one of the values in the combobox
function lookUpComboboxDataByValue(element, value, valueField) {
    if(MiscUtil.isUndefinedOrNull(valueField)){
        valueField = "value";
    }
    var rows = $(element).combobox('getData');
    for (var i = 0; i < rows.length; i++) {
        if (rows[i][valueField] == value) {
            return rows[i];
        }
    }

    return null;
}

function caseInsensitiveContains(base, searchString) {
    var lbase = base.toLowerCase();
    var lSearchString = searchString.toLowerCase();

    return lbase.indexOf(lSearchString) >= 0;
}

function showErrorInValidationSpan(element, message) {
    $(element).css({visibility: 'visible'});
    $(element).text(message);
    $(element).css({opacity: 0.0, display: "block"}).animate({opacity: 1.0});
}
function showError(item, message) {
    $(item).css({display: 'inline-block'});
    if (message == null) {
        message = 'Required Field';
    }
    $(item).text(message);
    $(item).css({opacity: 0.0, visibility: "visible"}).animate({opacity: 1.0});
}

//edit function name to indicate inclusiveness of c
function containsDigitsOnly(value) {
    var digitOnlyRegexObj = /^c?[0-9]+$/i;
    return digitOnlyRegexObj.test(value);
}

function getSubjectData(subjectId, isPuid, callBack) {
    var jsonData = JSON.stringify({id: subjectId});
    $.get("rest/subject/getSubjectData?data=" + encodeURIComponent(jsonData) + "&isPuid=" + isPuid, function (data) {
        var parsedData = JSON.parse(data);
        if (typeof callBack == 'function') {
            callBack(parsedData);
        }
    });
}

function getExternalSubjectData(subjectMrn, subjectInstitution, callBack) {
    if (subjectInstitution) {
        subjectInstitution = subjectInstitution.toUpperCase();
    }

    var jsonData = JSON.stringify({mrnInfo: {value: subjectMrn, institution: subjectInstitution}});
    $.post("rest/subject/getExternalSubjectDataUsingMrn", {data: jsonData}, function (data) {
        var parsedData = JSON.parse(data);
        if (typeof callBack == 'function') {
            callBack(parsedData);
        }
    });
}

function findInternalSubject(mrnInfoList, callBack) {
    var jsonData = JSON.stringify({mrnInfoList: mrnInfoList});
    $.get("rest/subject/findInternalSubjectByMrn?mrnInfo=" + encodeURIComponent(jsonData), function (data) {
        if (typeof callBack == 'function') {
            var parsedData = null;

            if (data != null) {
                parsedData = JSON.parse(data);
            }

            callBack(parsedData);
        }
    });
}

function unifiedPhoneNumbersFormat(phone) {
    var phoneNumberRaw = ("" + phone).replace(/\D/g, '');
    var phoneFormated = phoneNumberRaw.match(/^(\d{3})(\d{3})(\d{4})$/);
    return (!phoneFormated) ? phone : "(" + phoneFormated[1] + ") " + phoneFormated[2] + "-" + phoneFormated[3];
}

function escapeQuotesHTML(string) {
    string = string.replace(/"/g, "\\&#34;").replace(/'/g, "\\&#39;");
    return string;
}

function isEmpty(value) {
    return value === undefined || value === null || value.length == 0;
}

function createComboBox(element) {
    $(element).combobox({
        prompt: "Choose or Type Ahead"
    });
}

function getRegistrationStaticLists() {
    $.get("rest/app/getStaticLists", {}, function (data) {

        parsedData = JSON.parse(data);

        roles = parsedData.roles;
        credentials = parsedData.credentials;
        divisions = parsedData.divisions;
        departments = parsedData.departments;
        facultyRanks = parsedData.facultyRanks;
        institutions = parsedData.institutions;

        roleSelectOptions = buildSelectOptions(roles, 'name');
        institutionSelectOptions = buildSelectOptions(institutions, 'longName');
        credentialSelectOptions = buildSelectOptions(credentials, 'name', '');
        departmentSelectOptions = buildSelectOptions(departments, 'name', '');
        divisionSelectOptions = buildSelectOptions(divisions, 'name', '');
        facultyRankSelectOptions = buildSelectOptions(facultyRanks, 'name', '');


        $("#registration_role").html(roleSelectOptions);
        $("#registration_institution").html(institutionSelectOptions);
        $("#registration_credential").html(credentialSelectOptions);
        $("#registration_division").html(divisionSelectOptions);
        $("#registration_department").html(departmentSelectOptions);
        $("#registration_facultyRank").html(facultyRankSelectOptions);


        WidgetUtil.createComboBox(".formSelectInput");
    });
}

function selectRow(tdClass) {
    $(tdClass).parent().addClass(SCHEDULER_CLASS_NAME.selectedRow);
}

function unSelectRow(tdClass) {
    $(tdClass).parent().removeClass(SCHEDULER_CLASS_NAME.selectedRow);
}


var PageLoadUtil = function () {};

// cannot give the element as the argument, since the element doesn't exist yet when
// the method is called, element can only be made after the header is added to the page,
// inside the load
PageLoadUtil.loadPage = function(navBarClass, initFn, shouldBlockUI)
{
    if (shouldBlockUI) {
        $.blockUI();
    }

    $("#fullHeader").load("header.html", function () {
        var navBarElement = $(navBarClass);
        navBarElement.addClass('active');
        initFn();

        if (shouldBlockUI) {
            $.unblockUI();
        }
    });
};

function callbackFuncIfDefined(callbackFunc) {
    if (callbackFunc !== undefined) {
        callbackFunc();
    }
}


function strEndsWith(str, suffix) {
    return str.match(suffix+"$")==suffix;
}


/**
 These wrapper functions were created for testability.
 window.location.href cannot be mocked by test frameworks,
 so we created a getter and a setter for it. These can be
 mocked / stubbed.
 */

function getLocationHref() {
    return window.location.href;
}

function setLocationHref(url) {
    window.location.href = url;
}


function getParentLocationHash() {
    return parent.location.hash;
}

function setParentLocationHash(hash) {
    parent.location.hash = hash;
}

function getLocationHash() {
    return window.location.hash;
}

function setLocationHash(hash) {
    window.location.hash = hash;
}

function locationContains(partialLocation) {
    return getLocationHref().indexOf(partialLocation) > -1;
}

function escapeJQSelector(jqSelectorStr)
{
    return jqSelectorStr.replace( /(:|\.|\[|\]|,|=|@)/g, "\\$1" );
}

var MiscUtil = {};
MiscUtil.isNotUndefinedOrNullOrEmpty = function(value){
    return value !== undefined && value !== null && value.length > 0;
};

MiscUtil.isNotUndefinedOrNull = function(value){
    return value !== undefined && value !== null;
};

MiscUtil.isUndefinedOrNull = function(value){
    return value === undefined || value === null;
};

MiscUtil.isUndefinedOrNullOrEmpty = function(value){
    return value === undefined || value === null || value.length == 0;
};

MiscUtil.adjustSelectElemTabIndex = function() {
    var element = $(this);

    var tabIndex = parseInt($(this).attr("tabindex"));
    element.parent().find(".textbox-text")
        .attr("tabindex", tabIndex)
        .on("keydown", function (event) {
            if (event.which == keyCodes.DOWN || event.which == keyCodes.UP) {
                element.combobox("showPanel");
            }
        });
};

//copies the tab index from the original input element
//to the new switch toggle
MiscUtil.adjustSwitchToggleTabIndex = function(element) {
    var tabIndex = parseInt($(element).attr("tabindex"));
    $(element).parent().find(".switchbutton")
        .attr("tabindex", tabIndex)
        .on("keydown", function (event) {
            if (event.which == keyCodes.RIGHT) {
                $(element).switchbutton("check");
            }
            else if (event.which == keyCodes.LEFT) {
                $(element).switchbutton("uncheck");
            }
        });
};

function findStudyStatusById(id) {
    var foundStudyStatus = null;
    studyStatuses.forEach(function(studyStatus) {
        if (studyStatus.id == id) {
            foundStudyStatus = studyStatus;
        }
    })
    return foundStudyStatus;
}
MiscUtil.genderShortName = function(gender){
    var genderMap = {
        'Female': 'F',
        'Male': 'M',
        'Female to Male': 'F to M',
        'Male to Female': 'M to F',
        'Declined': 'D',
        'Unreported': 'U'
    };

    gender = $.trim(gender);

    gender = genderMap[gender];

    return gender || '';
};

MiscUtil.isOutpatientVisit = function(visitTypeId){
    return visitTypeId == VisitTypes.OutpatientCRC || visitTypeId == VisitTypes.OutpatientNonCRC || visitTypeId == VisitTypes.OutpatientOffInstitution;
};

MiscUtil.isInpatientVisit = function(visitTypeId){
    return visitTypeId == VisitTypes.InpatientCRC || visitTypeId == VisitTypes.InpatientNonCRC || visitTypeId == VisitTypes.InpatientOffInstitution;
};
