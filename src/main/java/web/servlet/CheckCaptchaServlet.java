package web.servlet;

import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.*;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;

@WebServlet("check-captcha")
public class CheckCaptchaServlet extends HttpServlet {
    private final static String SECRTE_KEY =
            "6LcIgPUrAAAAAHDgyMdhDn866T_jBYSvCX6p6OGY";
    private static final String ERROR_TEMPLATE = """
            {
                "error": "%s"
            }
            """;

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse res)
            throws IOException {
        res.setContentType("application/json;charset=UTF-8");
        res.setCharacterEncoding("UTF-8");

        String clientResponse = req.getParameter("response");

        String uri = "https://www.google.com/recaptcha/api/siteverify?secret="
                + URLEncoder.encode(SECRTE_KEY, StandardCharsets.UTF_8)
                + "&response="
                + URLEncoder.encode(clientResponse, StandardCharsets.UTF_8);

        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(uri))
                .header("Content-Type",
                        "application/x-www-form-urlencoded; charset=UTF-8")
                .POST(HttpRequest.BodyPublishers.noBody())
                .build();

        try {
            HttpResponse<String> response = client.send(request,
                    HttpResponse.BodyHandlers.ofString());
            res.getWriter().write(response.body());
        } catch (InterruptedException e) {
            res.setContentType("application/json;charset=UTF-8");
            res.setCharacterEncoding("UTF-8");
            res.setStatus(500);

            String errorJson = String.format(ERROR_TEMPLATE, e.getMessage());
            res.getWriter().write(errorJson);
        }
    }
}
