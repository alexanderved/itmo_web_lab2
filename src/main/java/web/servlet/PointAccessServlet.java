package web.servlet;

import jakarta.json.bind.Jsonb;
import jakarta.json.bind.JsonbBuilder;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import web.model.Point;
import web.repository.PointRepository;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.List;

@WebServlet("access-points")
public class PointAccessServlet extends HttpServlet {
    private static final String ERROR_TEMPLATE = """
            {
                "error": "%s"
            }
            """;

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse res)
            throws IOException {
        res.setContentType("application/json;charset=UTF-8");
        res.setCharacterEncoding("UTF-8");

        String rStr = req.getParameter("r");

        var repo = (PointRepository) req.getSession().getAttribute("repo");
        if (repo == null) {
            res.getWriter().write("[]");

            return;
        }

        try (Jsonb builder = JsonbBuilder.create()) {
            if (rStr == null) {
                String json = builder.toJson(repo.get());
                res.getWriter().write(json);
            } else {
                BigDecimal r = new BigDecimal(rStr.replace(",", "."));
                List<Point> filteredPoints = repo.get()
                        .stream()
                        .filter(p -> p.r().compareTo(r) == 0)
                        .toList();

                String json = builder.toJson(filteredPoints);
                res.getWriter().write(json);
            }
        } catch (Exception e) {
            res.setContentType("application/json;charset=UTF-8");
            res.setCharacterEncoding("UTF-8");
            res.setStatus(500);

            String errorJson = String.format(ERROR_TEMPLATE, e.getMessage());
            res.getWriter().write(errorJson);
        }
    }

    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse res) {
        var repo = (PointRepository) req.getSession().getAttribute("repo");
        if (repo == null) {
            return;
        }

        repo.clear();
        res.setStatus(200);
    }
}
