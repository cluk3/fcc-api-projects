$(document).ready(function() {

	var file;
	$('input[type=file]').on('change', function() {
		file = event.target.files;
	});
	$('form').on('submit', function(event) {

		event.stopPropagation();
		event.preventDefault();

		var data = new FormData();
		
		data.append('temp', file[0]);
	

		$.ajax({
			url: window.location.origin + '/fm/api/',
			type: 'POST',
			data: data,
			cache: false,
			processData: false,
			contentType: false,
			error: function(jqXHR, textStatus, errorThrown) {
				$('#size').text('Error').css('color','red');
			},
			success: function(data) {
			  var size = parseInt(data.size)/1000
				$('#size').text(size+' kB');
			}
		});
	});
});