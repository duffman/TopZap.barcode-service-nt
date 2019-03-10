/**
 * Copyright (c) Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * March 2019
 */
"use strict";
var drone_config_1 = require("./drone-config");
var Pusher = require('pusher-client');
var pusher = new Pusher(drone_config_1.DroneConfig.Development.key, { cluster: 'eu' });
var order_book_channel = pusher.subscribe('getBid');
order_book_channel.bind('data', function (data) {
    console.log(data);
});
/*
let pusher = new Pusher('fae6c314f74fb399e2ac', {
    cluster: 'eu',
    forceTLS: true
});

var channel = pusher.subscribe('my-channel');
channel.bind('my-event', function(data) {
    alert(JSON.stringify(data));
});
*/
/*
let socket = new Pusher(DroneConfig. 'MY_API_KEY');
var my_channel = socket.subscribe('my-channel');
socket.bind('new-comment',
    function(data) {
        // add comment into page
    }
);
*/
