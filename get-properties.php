<?php   
    $response = file_get_contents("config.json");

    header('Access-Control-Allow-Origin: *');
    header('Content-type: application/json; charset=utf-8');  
    echo $response;
?>