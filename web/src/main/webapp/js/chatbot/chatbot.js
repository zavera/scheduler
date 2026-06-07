/*
 * Copyright (c) 2015-2016, President and Fellows of Harvard College
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright
 * notice, this list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright
 * notice, this list of conditions and the following disclaimer in the
 * documentation and/or other materials provided with the distribution.
 *
 * 3. The name of the author may not be used to endorse or promote products
 * derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE AUTHOR "AS IS" AND ANY EXPRESS OR IMPLIED
 * WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO
 * EVENT SHALL THE AUTHOR BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED
 * TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
 * PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
 * LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 * NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

var ChatBot = (function () {

    var CHATBOT_API = 'http://localhost:8001';
    var history = [];
    var $messages, $input, $sendBtn;

    function init() {
        $messages = $('#chatbot-messages');
        $input    = $('#chatbot-input');
        $sendBtn  = $('#chatbot-send-btn');
        $input.focus();
    }

    function handleKey(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            send();
        }
    }

    function sendExample(el) {
        $input.val($(el).text());
        send();
    }

    function send() {
        var message = $input.val().trim();
        if (!message) return;

        $input.val('');
        appendMessage('user', message);
        setLoading(true);

        $.ajax({
            url: CHATBOT_API + '/chat',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ message: message, history: history }),
            success: function (data) {
                setLoading(false);
                history.push({ role: 'user', content: message });
                history.push({ role: 'assistant', content: data.reply });
                if (history.length > 20) history = history.slice(-20);
                appendAssistantMessage(data);
            },
            error: function (xhr) {
                setLoading(false);
                var msg = (xhr.responseJSON && xhr.responseJSON.detail)
                    ? xhr.responseJSON.detail
                    : 'Could not reach the chatbot service. Is it running on port 8001?';
                appendMessage('error', msg);
            }
        });
    }

    function clear() {
        history = [];
        $messages.empty();
        $input.focus();
    }

    function appendMessage(role, text) {
        var cls = role === 'user' ? 'msg-user' : (role === 'error' ? 'msg-error' : 'msg-assistant');
        var label = role === 'user' ? 'You' : (role === 'error' ? 'Error' : 'Assistant');
        var $msg = $('<div class="chat-message ' + cls + '">');
        $msg.append('<div class="msg-label">' + label + '</div>');
        $msg.append('<div class="msg-text">' + escapeHtml(text) + '</div>');
        $messages.append($msg);
        scrollBottom();
    }

    function appendAssistantMessage(data) {
        var $msg = $('<div class="chat-message msg-assistant">');
        $msg.append('<div class="msg-label">Assistant</div>');

        var replyText = (data.reply || '').trim();
        if (replyText) {
            $msg.append('<div class="msg-text">' + escapeHtml(replyText) + '</div>');
        }

        if (data.sql) {
            var $sqlBlock = $('<div class="sql-block">');
            $sqlBlock.append('<div class="sql-label">Generated SQL <button class="copy-btn" onclick="ChatBot.copySQL(this)">Copy</button></div>');
            $sqlBlock.append('<pre class="sql-code">' + escapeHtml(data.sql) + '</pre>');
            $msg.append($sqlBlock);
        }

        if (data.error && data.error !== 'unsafe_sql') {
            $msg.append('<div class="query-error">Query error: ' + escapeHtml(data.error) + '</div>');
        }

        if (data.rows && data.rows.length > 0) {
            $msg.append(buildTable(data.columns, data.rows));
            if (data.rows.length >= 200) {
                $msg.append('<div class="row-limit-note">Showing first 200 rows. Refine your question to narrow results.</div>');
            }
            $msg.append(buildExportBtn(data.columns, data.rows));
        } else if (data.sql && (!data.rows || data.rows.length === 0) && !data.error) {
            $msg.append('<div class="msg-text no-results">No results found.</div>');
        }

        $messages.append($msg);
        scrollBottom();
    }

    function buildTable(columns, rows) {
        var $wrap = $('<div class="result-table-wrap">');
        var $table = $('<table class="result-table">');

        var $thead = $('<thead><tr>');
        $.each(columns, function (_, col) {
            $thead.find('tr').append('<th>' + escapeHtml(col) + '</th>');
        });
        $table.append($thead);

        var $tbody = $('<tbody>');
        $.each(rows, function (_, row) {
            var $tr = $('<tr>');
            $.each(columns, function (_, col) {
                var val = row[col];
                $tr.append('<td>' + (val === null || val === undefined ? '<span class="null-val">—</span>' : escapeHtml(String(val))) + '</td>');
            });
            $tbody.append($tr);
        });
        $table.append($tbody);
        $wrap.append($table);
        return $wrap;
    }

    function buildExportBtn(columns, rows) {
        var $btn = $('<button class="export-btn">Export CSV</button>');
        $btn.on('click', function () { exportCSV(columns, rows); });
        return $btn;
    }

    function exportCSV(columns, rows) {
        var lines = [columns.map(csvEscape).join(',')];
        $.each(rows, function (_, row) {
            lines.push(columns.map(function (col) {
                return csvEscape(row[col] === null || row[col] === undefined ? '' : String(row[col]));
            }).join(','));
        });
        var blob = new Blob([lines.join('\n')], { type: 'text/csv' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = 'scheduler-report-' + new Date().toISOString().slice(0, 10) + '.csv';
        a.click();
        URL.revokeObjectURL(url);
    }

    function csvEscape(val) {
        var s = String(val);
        if (s.indexOf(',') >= 0 || s.indexOf('"') >= 0 || s.indexOf('\n') >= 0) {
            return '"' + s.replace(/"/g, '""') + '"';
        }
        return s;
    }

    function copySQL(btn) {
        var code = $(btn).closest('.sql-block').find('.sql-code').text();
        navigator.clipboard.writeText(code).then(function () {
            $(btn).text('Copied!');
            setTimeout(function () { $(btn).text('Copy'); }, 1500);
        });
    }

    function setLoading(on) {
        if (on) {
            $sendBtn.prop('disabled', true).text('...');
            var $typing = $('<div class="chat-message msg-assistant msg-typing" id="typing-indicator">');
            $typing.append('<div class="msg-label">Assistant</div>');
            $typing.append('<div class="typing-dots"><span></span><span></span><span></span></div>');
            $messages.append($typing);
            scrollBottom();
        } else {
            $sendBtn.prop('disabled', false).text('Send');
            $('#typing-indicator').remove();
        }
    }

    function scrollBottom() {
        $messages.scrollTop($messages[0].scrollHeight);
    }

    function escapeHtml(str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    return { init: init, send: send, clear: clear, handleKey: handleKey, sendExample: sendExample, copySQL: copySQL };

}());
