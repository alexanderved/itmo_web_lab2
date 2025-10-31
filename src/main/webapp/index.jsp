<%@ page import="web.repository.PointRepository" %>
<%@ page import="web.model.Point" %>
<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html lang="en-US">
    <head>
        <meta charset="UTF-8">
        <title>Web Lab1</title>

        <script defer src="scripts/index.js"></script>
        <link rel="stylesheet" href="stylesheets/index.css">

        <script src="https://www.google.com/recaptcha/api.js?render=explicit"
                async defer>
        </script>
    </head>

    <body>
        <header>
            <div>
                <p>Ведехин Александр Вадимович</p>
                <p>Группа P3218</p>
                <p>Вариант 23462</p>
            </div>
        </header>

        <main>
            <h3>Ввод данных</h3>

            <div id="content">
                <div id="data-form">
                    <table>
                        <tr class="form-field">
                            <td>
                                <b>Введите X:</b>
                            </td>
                            <td>
                                <div id="x-buttons">
                                    <div class="x-button-row">
                                        <button class="x-button" value="-5">-5</button>
                                        <button class="x-button" value="-4">-4</button>
                                        <button class="x-button" value="-3">-3</button>
                                    </div>

                                    <div class="x-button-row">
                                        <button class="x-button" value="-2">-2</button>
                                        <button class="x-button" value="-1">-1</button>
                                        <button class="x-button" value="0">0</button>
                                    </div>

                                    <div class="x-button-row">
                                        <button class="x-button" value="1">1</button>
                                        <button class="x-button" value="2">2</button>
                                        <button class="x-button" value="3">3</button>
                                    </div>
                                </div>
                            </td>
                        </tr>

                        <tr class="form-field">
                            <td>
                                <label for="y"><b>Введите Y:</b></label>
                            </td>
                            <td>
                                <input type="text"
                                       id="y"
                                       class="form-input"
                                       name="y"
                                       size="5"
                                       placeholder="-3 ... 5"
                                />
                            </td>
                        </tr>

                        <tr class="form-field">
                            <td>
                                <label for="r"><b>Введите R:</b></label>
                            </td>
                            <td>
                                <input type="text"
                                       id="r"
                                       class="form-input"
                                       name="r"
                                       size="5"
                                       placeholder="2 ... 5"
                                />
                            </td>
                        </tr>

                        <tr><td colspan="2" id="error-field" hidden></td></tr>

                        <tr>
                            <td colspan="2" id="form-submit">
                                <button id="submit-button" type="submit">Отправить</button>
                            </td>
                        </tr>

                        <tr>
                            <td colspan="2" id="history-clear">
                                <button id="history-clear-button" type="reset">
                                    Очистить историю
                                </button>
                            </td>
                        </tr>
                    </table>
                </div>

                <div id="canvas-area">
                    <canvas id="graph" width="400" height="400">

                    </canvas>
                </div>
            </div>

            <h3 id="results-label">Результаты</h3>

            <table id="results-table">
                <tr class="result-row">
                    <th class="value">X</th>
                    <th class="value">Y</th>
                    <th class="value">R</th>
                    <th class="info">Попадение</th>
                </tr>
                <%
                    PointRepository repo = (PointRepository) session.getAttribute("repo");
                    if (repo != null) {
                        for (int i = repo.get().size() - 1; i >= 0; i--) {
                            Point point = repo.get().get(i);
                %>
                    <tr class="result-row">
                        <td>
                            <%= point.x() %>
                        </td>
                        <td>
                            <%= point.y() %>
                        </td>
                        <td>
                            <%= point.r() %>
                        </td>
                        <td>
                            <%= point.isHit() ? "Успех" : "Неудача" %>
                        </td>
                    </tr>
                <%
                        }
                    }
                %>
            </table>
        </main>
    </body>
</html>