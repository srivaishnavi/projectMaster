var companyList = null;
var divisionList = null;
var projectList = null;

var MAINPROJECTPROJECTNAME = null;
var MAINPROJECTPROJECTSHORTNAME = null;
var MAINPROJECTSTARTDATE = null;
var MAINPROJECTENDDATE = null;
var MAINPROJECTREVISEDENDDATE = null;
var MAINPROJECTOCV = null;
var MAINPROJECTRCV = null;

function initialize(){

$.ajax({
      type: 'POST',
      url: "http://localhost:8000/api/projectmaster",
      data: JSON.stringify({
 			"session_token": "a5fa5f8fc7ae4d7bbdef4b8bdf2bd385",
 			"request": [
  				"GetProjectMaster",
  				{}
			 ]	
		}),
      dataType: "JSON",
      success: function(resultData) { 

      	console.log("Save Complete"+ JSON.stringify(resultData));

      	var data = resultData[1];

      	console.log(data.division_list);
      	companyList = data.company_list;
      	divisionList = data.division_list;
      	projectList = data.project_list;
      	loadCompanylist();


      }
	});


}

function loadCompanylist() {
    $('.company-name  option:gt(0)').remove();
    $.each(companyList, function(key, value) {
    	var optionHtml = '<option value = "'+value['companyid']+'" >'+value['companyname']+'</option>'
        $('.company-name').append(optionHtml);

    });
}

function loadDivisionlist(id){
	$('.division-name  option:gt(0)').remove();
    $('.project-name  option:gt(0)').remove();

	$.each(divisionList, function(key, value) {
		console.log(value.companyid);
            if(value.companyid == id){
            	var optHtml = '<option  value = "'+value.divisionid+'"> '+value.divisionname +'</option>';
                $('.division-name').append(optHtml);
            }
     });

}

function loadProjectMasterDetails(id){
	$(".error-message").html("");
	var sno = 1;  

	$(".tbody-project-master-list").find("tr").remove();
    $('.project-name  option:gt(0)').remove();


$.each(projectList, function(key, value) {
            if(value.division_id == id && value.issubproject == 0 ){
            	var optHtml = '<option  value = "'+value.project_id+'"> '+value.project_name +'</option>';
                $('.project-name').append(optHtml);

                var tableRowvalues = $('#templates .table-project-master-list .table-row-list');
                var cloneval = tableRowvalues.clone();
                console.log(cloneval);
              	$(".sno",cloneval).html(sno);
                console.log(cloneval);
                
 				        $('.subprojectname', cloneval).html( value.project_name);
                $('.subprojectshortname', cloneval).html(value.project_short_name);
                $('.ocv', cloneval).html(value.ocv);
                $('.startdate', cloneval).html(value.startdate);
                $('.enddate', cloneval).html(value.enddate);
                $('.rcv', cloneval).html(value.rcv);
                $('.r_enddate', cloneval).html(value.r_enddate);
                $('.edit', cloneval).html('<a title="Edit Project"><span aria-hidden="true" class="glyphicon glyphicon-pencil gi-2x edit"></span></a>');
                $(".edit", cloneval).on("click", function() {
                    $(".add-form").show();
                    	$(".error-message").html("");
                    $(".add-projectid").val(value.project_id);
                    editprojectlist(value.project_id);
                });

                $('.delete', cloneval).html('<a title="Delete Project"><span aria-hidden="true" class="glyphicon glyphicon-trash gi-2x"></span></a>');            
                $(".delete", cloneval).on("click", function() {
                    deleteProjectList(value.project_id);
                });

              
                if(value['isactive'] == 1){
                    $('.is-active', cloneval).html('<a title="Click here to Deactivate"><span aria-hidden="true" class="glyphicon glyphicon-ok gi-2x"></span></a>');
                }
                else{
                    $('.is-active', cloneval).html('<a title="Click here to activate"><span aria-hidden="true" class="glyphicon glyphicon-remove gi-2x"></span></a>');
                    }
                $(".is-active", cloneval).on("click", function() {
                    changeStatusProjectList(value.project_id, value['isactive']);
                });

               	$('.tbody-project-master-list').append(cloneval);


            sno++;
            }
     });              
}


function loadSubprojectMasterDetails(id) {

    SNO = 1;    
    var sumspocv = 0;
    var sumsprcv = 0;

    $(".tbody-project-master-list").find("tr").remove();
    $(".tbody-sum-project-master-list").find("tr").remove();
    var getdivisionid = $(".division-name").val();
    if(id == '') {
        loadProjectMasterDetails(getdivisionid);
        return false;
    }
    $.each(projectList, function(k, value) {
        if(value["project_id"] == parseInt(id)){
            console.log("projectID = id")
            MAINPROJECTPROJECTNAME = value["project_name"];
            MAINPROJECTPROJECTSHORTNAME = value["project_short_name"];
            MAINPROJECTOCV = value["ocv"];
            MAINPROJECTSTARTDATE = value["startdate"];
            MAINPROJECTENDDATE = value["enddate"];
            MAINPROJECTRCV = value["rcv"];
            MAINPROJECTREVISEDENDDATE = value["r_enddate"];           
        }
    });
    $.each(projectList, function(k, value) {
        console.log("in if " + value.issubproject + "ppid " +value["parent_project_id"] + " id-> "+ id);
        if(value["issubproject"] != 0 && value["parent_project_id"] == parseInt(id)){             
            
            console.log("in if ");

            var tableRowvalues = $('#templates .table-project-master-list .table-row-list');
            var cloneval = tableRowvalues.clone();
            var subprojectid = value['project_id'];
            console.log(value['project_id']);
            $('.sno', cloneval).html(SNO);
            $('.subprojectname', cloneval).html( value['project_name']);
            $('.subprojectshortname', cloneval).html(value['project_short_name']);
            $('.ocv', cloneval).html(value['ocv']);
            sumspocv = parseFloat(sumspocv) + parseFloat(value['ocv']);
            $('.startdate', cloneval).html(value['startdate']);
            $('.enddate', cloneval).html(value['enddate']);
            if(value['rcv'] != null){
                sumsprcv = parseFloat(sumsprcv) + parseFloat(value['rcv']);    
            }            
            $('.rcv', cloneval).html(value['rcv']);
            $('.r_enddate', cloneval).html(value['r_enddate']);
            // $('.edit', cloneval).html('<a href="#" title="Edit"><span aria-hidden="true" class="glyphicon glyphicon-pencil gi-2x"></span> </a>');
            $(".edit", cloneval).on("click", function() {
                $(".add-form").show();
                $(".add-button").hide();
                clearMessage();
                $(".add-projectid").val(subprojectid);
                editprojectlist(subprojectid);
            });  
            $('.delete', cloneval).html('<span aria-hidden="true" class="glyphicon glyphicon-trash gi-2x"></span>');            
            if(value['isactive'] == 1){
                var classname = "glyphicon-ok";
            }
            else{
                var classname = "glyphicon-remove";   
            }
            $(".delete", cloneval).on("click", function() {
                deleteProjectList(subprojectid);
            });
            $('.is-active', cloneval).html('<span aria-hidden="true" class="glyphicon '+classname+' gi-2x"></span>');
            $(".is-active", cloneval).on("click", function() {
                changeStatusProjectList(subprojectid, value['isactive']);
            }); 
            $('.tbody-project-master-list').append(cloneval);
            SNO++;
        }     
    });
    var tableRowSumvalues = $('#templates .table-project-master-list .sumation-total');
    var clonesumval = tableRowSumvalues.clone();
    $(".st-ocv-sum", clonesumval).text(sumspocv);
    $(".st-rcv-sum", clonesumval).text(sumsprcv);
    $('.tbody-project-master-list').append(clonesumval);

    var tableRowSumvaluesPrjt = $('#templates .table-project-master-list .project-sumation-total');
    var clonesumvalprjt = tableRowSumvaluesPrjt.clone();
    $(".pst-projectname", clonesumvalprjt).text(MAINPROJECTPROJECTNAME);
    $(".pst-projectshortname", clonesumvalprjt).text(MAINPROJECTPROJECTSHORTNAME);
    $(".pst-ocv-total", clonesumvalprjt).text(MAINPROJECTOCV);
    $(".pst-rcv-total", clonesumvalprjt).text(MAINPROJECTRCV);
    $('.tbody-project-master-list').append(clonesumvalprjt);    
}


function loadSubprojectMasterDetails123(id){
	var sno = 1; 
  console.log(JSON.stringify(projectList));

  $(".tbody-project-master-list").find("tr").remove();

  $.each(projectList, function(key, value) {
    console.log(value);
                  console.log("value "+ value.issubproject + " Parent Project Id "+ value.parent_project_id +  " Id "+ id);
                  if(value.parent_project_id == parseInt(id))
                    console.log("***-> " + value.project_name);

              if(value.project_id == id && value.issubproject != 0 ){

       //        	var tableRowvalues = $('#templates .table-project-master-list .table-row-list');
       //            var cloneval = tableRowvalues.clone();
       //            $(".sno",cloneval).html(sno);
   		 //            $('.subprojectname', cloneval).html( value.project_name);
       //            $('.subprojectshortname', cloneval).html(value.project_short_name);
       //            $('.ocv', cloneval).html(value.ocv);
       //            $('.startdate', cloneval).html(value.startdate);
       //            $('.enddate', cloneval).html(value.enddate);
       //            $('.rcv', cloneval).html(value.rcv);
       //            $('.r_enddate', cloneval).html(value.r_enddate);

       //           	$('.tbody-project-master-list').append(cloneval);



        var tableRowvalues = $('#templates .table-project-master-list .table-row-list');
                var cloneval = tableRowvalues.clone();
                $(".sno",cloneval).html(sno);
                $('.subprojectname', cloneval).html( value.project_name);
                $('.subprojectshortname', cloneval).html(value.project_short_name);
                $('.ocv', cloneval).html(value.ocv);
                $('.startdate', cloneval).html(value.startdate);
                $('.enddate', cloneval).html(value.enddate);
                $('.rcv', cloneval).html(value.rcv);
                $('.r_enddate', cloneval).html(value.r_enddate);
                $('.edit', cloneval).html('<a title="Edit Project"><span aria-hidden="true" class="glyphicon glyphicon-pencil gi-2x edit"></span></a>');
                $(".edit", cloneval).on("click", function() {
                    $(".add-form").show();
                      $(".error-message").html("");
                    $(".add-projectid").val(value.project_id);
                    editprojectlist(value.project_id);
                });

                $('.delete', cloneval).html('<a title="Delete Project"><span aria-hidden="true" class="glyphicon glyphicon-trash gi-2x"></span></a>');            
                $(".delete", cloneval).on("click", function() {
                    deleteProjectList(value.project_id);
                });

              
                if(value['isactive'] == 1){
                    $('.is-active', cloneval).html('<a title="Click here to Deactivate"><span aria-hidden="true" class="glyphicon glyphicon-ok gi-2x"></span></a>');
                }
                else{
                    $('.is-active', cloneval).html('<a title="Click here to activate"><span aria-hidden="true" class="glyphicon glyphicon-remove gi-2x"></span></a>');
                    }
                $(".is-active", cloneval).on("click", function() {
                    changeStatusProjectList(value.project_id, value['isactive']);
                });

                $('.tbody-project-master-list').append(cloneval);

                sno++;
              }
          });


}

function addnewprojectview(){

	if($(".company-name").val() == ""){
      $(".error-message").html("Select a company");
       return false;
 	}
 	if($(".division-name").val() == ""){
      $(".error-message").html("Select a Division");
       return false;
 	}

	$(".add-form").show();
	$(".add-btn").hide();
	show_datepicker();
	$(".error-message").html("");

}

show_datepicker = function() {
    $( ".add-startdate, .add-enddate, .add-renddate" ).datepicker({
        showButtonPanel: true,
        closeText: 'Clear',
        changeMonth: true,
        changeYear: true,        
        numberOfMonths: 1,
        dateFormat: "dd-M-yy",
        onClose: function () {
            var event = arguments.callee.caller.caller.arguments[0];
            if ($(event.delegateTarget).hasClass('ui-datepicker-close')) {
                $(this).val('');
            }
        },
        onSelect: function( selectedDate ) {
            if($(this).hasClass("add-startdate") == true) {
                var dateMin = $('.add-startdate').datepicker("getDate");
                var rMin = new Date(dateMin.getFullYear(), dateMin.getMonth(), dateMin.getDate() + 1);
                $('.add-enddate').datepicker("option","minDate",rMin);
                var dateMin1 = $('.add-enddate').datepicker("getDate");
                if(dateMin1) {
                    var rMin1 = new Date(dateMin1.getFullYear(), dateMin1.getMonth(), dateMin1.getDate() + 1);             
                    $('.add-renddate').datepicker("option","minDate",rMin1);
                }
            }
            if($(this).hasClass("add-enddate") == true) {
              var dateMin = $('.add-enddate').datepicker("getDate");
              var rMin = new Date(dateMin.getFullYear(), dateMin.getMonth(), dateMin.getDate() + 1);
              $('.add-renddate').datepicker("option","minDate",rMin);             
            }
            if($(this).hasClass("add-renddate") == true) {
            }
        }
    });

}

function saveProject(companyid, maindivisionid, projectname, projectshortname, ocv, startdate, enddate, rcv, r_enddate, issubproject, parent_project_id) {
 
     var requestParams = {
        "session_token": "a5fa5f8fc7ae4d7bbdef4b8bdf2bd385",
        "request": [
            "SaveProjectMaster",
              {
                  "division_id": parseInt(maindivisionid),                
                  "project_name": projectname,
                  "project_short_name" : projectshortname,
                  "ocv": ocv,
                  "startdate": startdate,
                  "enddate": enddate,
                  "rcv": rcv,
                  "r_enddate": r_enddate,
                  "issubproject": issubproject,
                  "parent_project_id": parent_project_id
              }
          ]  
      }


      $.ajax({
        type: 'POST',
        url: "http://localhost:8000/api/projectmaster",
        data: JSON.stringify(requestParams),
        dataType: "JSON",
        success: function(resultData) { 
          console.log(resultData);

        }

      });

}

function editprojectlist(projectid){
    var p_p_id = 0;
    

    $.each(projectList, function(key, value){
        if(value["project_id"] == projectid){     
            $(".updatestatus").val('yes');   
            $(".add-projectid").val(value['project_id']);
            $(".add-projectname").val(value['project_name']);
            $(".add-projectshortname").val(value['project_short_name']);
            $(".add-ocv").val(value['ocv']);
            $(".add-startdate").val(value['startdate']);
            $(".add-enddate").val(value['enddate']);    
            $(".add-rcv").val(value['rcv']);
            $(".add-renddate").val(value['r_enddate']);
            $(".add-parent-project-id").val(value['parent_project_id']);
            p_p_id = value['parent_project_id'];
            show_datepicker();
        }
    });
    if(p_p_id != 0){
        $.each(PROJECTLIST, function(key, value){
            if(value["project_id"] == p_p_id){
                MAINPROJECTOCV = value["ocv"];
                MAINPROJECTSTARTDATE = value["startdate"];
                MAINPROJECTENDDATE = value["enddate"];
                MAINPROJECTREVISEDENDDATE = value["r_enddate"];
                MAINPROJECTRCV = value["rcv"];
            }
        });
    }
}

function updateProject(companyid, divisionid, projectid, projectname, projectshortname, 
                          ocv, startdate, enddate, rcv, r_enddate, issubproject, parent_project_id) {
 
     var requestParams = {
        "session_token": "a5fa5f8fc7ae4d7bbdef4b8bdf2bd385",
        "request": [
            "UpdateProjectMaster",
              {
                "division_id": divisionid,
                "project_id": projectid,
                "project_name": projectname,
                "project_short_name": projectshortname,
                "ocv": ocv,
                "startdate": startdate,
                "enddate": enddate,
                "rcv": rcv,
                "r_enddate": r_enddate,
                "issubproject": issubproject,
                "parent_project_id": parent_project_id 
              }
          ]  
      }


      $.ajax({
        type: 'POST',
        url: "http://localhost:8000/api/projectmaster",
        data: JSON.stringify(requestParams),
        dataType: "JSON",
        success: function(resultData) { 
          console.log(resultData);

        }

      });
}

function deleteProjectList(id){

  var request = [
            "DeleteRow",
            {
                "form_name": "projectmaster",
                "trn_id": parseInt(id)
            }
        ]
        var requestParams = {
        "session_token": "a5fa5f8fc7ae4d7bbdef4b8bdf2bd385",
        "request": request
      }


      $.ajax({
        type: 'POST',
        url: "http://localhost:8000/api/general",
        data: JSON.stringify(requestParams),
        dataType: "JSON",
        success: function(resultData) { 
          console.log(resultData);

        }

      });
}

function changeStatusProjectList(id, status){
    if(status == "0") {
        status = 1;
    }
    else{
        status = 0;
    }

   var request = [
            "ChangeStatus",
            {
                "form_name": "projectmaster",
                "trn_id": parseInt(id),
                "status": parseInt(status)
            }
        ]

        var requestParams = {
        "session_token": "a5fa5f8fc7ae4d7bbdef4b8bdf2bd385",
        "request": request
      }


      $.ajax({
        type: 'POST',
        url: "http://localhost:8000/api/general",
        data: JSON.stringify(requestParams),
        dataType: "JSON",
        success: function(resultData) { 
          console.log(resultData);

        }
      });

}