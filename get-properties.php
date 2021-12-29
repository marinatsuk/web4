<?php   
    $response = file_get_contents("style.json");

    header('Access-Control-Allow-Origin: *');
    header('Content-type: application/json; charset=utf-8');  
    echo $response;
?>