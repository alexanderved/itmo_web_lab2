<%@ page import="web.repository.PointRepository" %>
<%@ page import="web.model.Point" %>
<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html lang="en-US">
    <head>
        <meta charset="UTF-8">
        <title>Web Lab1</title>

        <!-- <script defer src="index.js"></script> -->
        <link rel="stylesheet" href="stylesheets/result.css">
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
                    if (repo != null && repo.get().size() > 0) {
                        Point lastPoint = repo.get().get(repo.get().size() - 1);
                %>
                    <tr class="result-row">
                        <td>
                            <%= lastPoint.x() %>
                        </td>
                        <td>
                            <%= lastPoint.y() %>
                        </td>
                        <td>
                            <%= lastPoint.r() %>
                        </td>
                        <td>
                            <%= lastPoint.isHit() ? "Успех" : "Неудача" %>
                        </td>
                    </tr>
                <%
                    }
                %>
            </table>

            <div>
                <button id="return-button"
                        onclick="window.location.href='/web-lab2/'">
                     Вернуться на главную
                </button>
            </div>
        </main>
    </body>
</html>