package web;

import com.fastcgi.FCGIInterface;
import web.network.ErrorResponse;

public class Main {
    public static void main(String[] args) {
        var fcgi = new FCGIInterface();
        while (fcgi.FCGIaccept() >= 0) {
            String method = System.getProperties().getProperty("REQUEST_METHOD");
            if (method == null || !method.equals("GET")) {
                System.out.println(new ErrorResponse("Неверный метод запроса"));
            }

            String params = System.getProperties().getProperty("QUERY_STRING");
            System.out.println(RequestHandler.handle(params).format());
        }
    }
}
