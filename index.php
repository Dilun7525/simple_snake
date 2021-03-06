<!DOCTYPE html>
<html lang="ru">
<head>
	<!-- Required meta tags -->
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

	<title>Test task</title>

	<!-- Bootstrap CSS -->
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta/css/bootstrap.min.css"
		  integrity="sha384-/Y6pD6FV/Vv2HJnA6t+vslU6fwYXjCFtcEpHbNJ0lyAFsXTsjBbfaDjzALeQsN6M" crossorigin="anonymous">
	<link rel="stylesheet" href="style.css">

</head>
<body>
<div class="container">

	<div class="row">
		<div class="col-2 justify-content-center">
			<div class="row">
				<label for="complexity">Сложность: </label>
				<select id="complexity" class="form-control">
					<option value="легкая">легкая</option>
					<option value="средняя" selected>средняя</option>
					<option value="сложная">сложная</option>
					<option value="очень сложная">очень сложная</option>
				</select>
			</div>
			<div class="row">
				<label for="sizeMatrix">Размер поля:</label>
				<input type="number" class="form-control" id="sizeMatrix">
			</div>
			<div class="row">
				<input id="btnBegin" class="btn btn-dark" type="button" value="Начать" onclick="beginGame()">
				<input id="btnReload" class="btn btn-dark" type="button" value="Сбросить" onclick="reload()">
			</div>


		</div>
		<div class="col justify-content-center">

			<div id="matrix">

			</div>
		</div>
		<div class="col-2">
			<div class="row">
				<label for="pointVictory">Очки:</label>
				<input type="text" class="form-control" id="pointVictory" value="0">
			</div>
			<div class="row">
				<label for="speed">Скорость:</label>
				<input type="text" class="form-control" id="speed" value="0">
			</div>
		</div>
	</div>

</div>


<!-- Optional JavaScript -->
<!-- jQuery first, then Popper.js, then Bootstrap JS -->
<!--<script src="https://code.jquery.com/jquery-3.2.1.slim.min.js"
		integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN"
		crossorigin="anonymous"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.11.0/umd/popper.min.js"
		integrity="sha384-b/U6ypiBEHpOf/4+1nzFpr53nxSS+GLCkfwBdFNTxtclqqenISfwAzpKaMNFNmj4"
		crossorigin="anonymous"></script>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta/js/bootstrap.min.js"
		integrity="sha384-h0AbiXch4ZDo7tp9hKZ4TsHbi047NrKGLO3SEJAg45jXxnGIfYzk4Si90RDIqNm1"
		crossorigin="anonymous"></script>
<script>window.JQuery || document.write('<script src="js/jquery.min.js"><\/script>');</script>
-->
<script language="javascript" src="script.js"></script>
</body>
</html>