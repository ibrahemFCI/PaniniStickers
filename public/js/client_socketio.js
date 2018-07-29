var socket = io.connect('http://localhost:3000',
{
    query:'userid='+$('#userid').val()
});