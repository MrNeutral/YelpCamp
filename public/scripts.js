$(".submit").on("click", function() {
	$(this).parent().prev().find("form").submit();
});