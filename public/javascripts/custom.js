/**
 * Created by edwardwalther on 12/19/15.
 */
$(function(){

    $("#enter_media_button").click(function(){


        var title = $("#title_text").val();
        var author = $("#author_text").val();
        var genre = $("#genre_select").val();

        if(title != "" && author != "" && genre != "") {
            $("#add_media_form").submit();
        }
        else{
            $(".alert").text("enter something")
        }
    });

    $("#enter_comment_button").click(function(){



        var name = $("#comment_name_id").val();
        var comment = $("#comment_text_id").val();


        if(name != "" && comment != "") {
            $("#comment_form").submit();
        }
        else{
            $(".alert").text("enter something")
        }
    });



    $("#enter_essay_button").click(function(){


        var title = $("#essay_title_text").val();
        var essay = $("#essay_text").val();

        if(title != "" && essay != "") {
            $("#enter_essay_form").submit();
        }
        else{
            $(".alert").text("enter something")
        }
    });



    $(".delete-record").click(function(){

        var id= $(this).attr("name");

        $(this).css("display", "none");
        $("#confirm_"+id).fadeIn("fast");
        $("#cancel_"+id).fadeIn("fast");

    });

    $(".cancel-delete").click(function(){

        var id= $(this).attr("name");

        $(this).css("display", "none");
        $("#confirm_"+id).css("display", "none");

        $("#delete_"+id).fadeIn("fast");

    })






});