<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>
    <h1>Testseite Json</h1>
    <div id="id"></div>
    <div id="name"></div>
    <p></p>
    <button class="button">Change to Hello</button>
    <button class="button2">Change to World</button>
    <button class="button3">Change Permanently</button>

    <?php
    $jsonString = file_get_contents('api.json');
    $data = json_decode($jsonString, true);

    $data['sentence'] = "Wie gehts?";
    // or if you want to change all entries with activity_code "1"
    /*foreach ($data as $key => $entry) {
        if ($entry['activity_code'] == '1') {
            $data[$key]['activity_name'] = "TENNIS";
        }
    }*/
    $newJsonString = json_encode($data);
    file_put_contents('api.json', $newJsonString);
    ?>


    <script>
        fetch("api.json")
            .then(response => response.json())
            .then(data => {
                document.querySelector("#id").innerText = data.sentence
            })

        const button = document.querySelector('.button');
        const button2 = document.querySelector('.button2');
        const button3 = document.querySelector('.button3');

        function changeHello() {
            fetch("api.json")
                .then(response => response.json())
                .then(data => {
                    data.sentence = "Hello"
                    document.querySelector("#id").innerText = data.sentence
                })
        }

        function changeWorld() {
            fetch("api.json")
                .then(response => response.json())
                .then(data => {
                    data.sentence = "World"
                    document.querySelector("#id").innerText = data.sentence
                })
        }

        function changePermanent() {
            const fileName = './api.json';
            const file = "./api.json";

            file.key = "neuer Wert";

            file.writeFile(fileName, JSON.stringify(file, null, 2), function writeJSON(err) {
                if (err) return console.log(err);
                console.log(JSON.stringify(file));
                console.log('writing to ' + fileName);
            });
        }

        button.addEventListener('click', changeHello)
        button2.addEventListener('click', changeWorld)
        button3.addEventListener('click', changePermanent)
    </script>
</body>

</html>