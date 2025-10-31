package web.servlet;

import jakarta.json.bind.Jsonb;
import jakarta.json.bind.JsonbBuilder;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import web.exceptions.PointParserException;
import web.model.Point;
import web.model.PointChecker;
import web.model.PointParser;
import web.model.UncheckedPoint;
import web.repository.PointRepository;

import java.io.IOException;

@WebServlet("check-area")
public class AreaCheckServlet extends HttpServlet {
    private static final String ERROR_TEMPLATE = """
            {
                "error": "%s"
            }
            """;

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse res)
            throws IOException, ServletException {
        String action = req.getParameter("action");
        boolean needsBoundCheck;
        switch (action) {
            case "submit":
                needsBoundCheck = true;
                break;

            case "click":
                needsBoundCheck = false;
                break;

            default:
                sendError(res, 400, "Выполнено неизвестное действие");
                return;
        }

        try {
            UncheckedPoint up = PointParser.parsePoint(req.getParameter("x"),
                    req.getParameter("y"),
                    req.getParameter("r"),
                    needsBoundCheck);
            Point p = PointChecker.checkPoint(up);

            HttpSession session = req.getSession();
            var repo = (PointRepository) session.getAttribute("repo");
            if (repo == null) {
                repo = new PointRepository();
                session.setAttribute("repo", repo);
            }
            repo.add(p);

            if (action.equals("submit")) {
                res.sendRedirect("./result.jsp");
            } else {
                try (Jsonb builder = JsonbBuilder.create()) {
                    String json = builder.toJson(p);
                    res.getWriter().write(json);
                } catch (Exception e) {
                    sendError(res, 500, e.getMessage());
                }
            }
        } catch (PointParserException e) {
            sendError(res, 400, e.getMessage());
        }
    }

    private void sendError(HttpServletResponse res, int code, String msg)
            throws IOException {
        res.setContentType("application/json;charset=UTF-8");
        res.setCharacterEncoding("UTF-8");
        res.setStatus(code);

        String errorJson = String.format(ERROR_TEMPLATE, msg);
        res.getWriter().write(errorJson);
    }
}
