package web.repository;

import jakarta.ejb.Stateful;
import jakarta.enterprise.context.SessionScoped;
import web.model.Point;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

@Stateful
@SessionScoped
public class PointRepository implements Serializable {
    private final List<Point> points = new ArrayList<>();

    public List<Point> get() {
        return points;
    }

    public void add(Point p) {
        points.add(p);
    }

    public void clear() {
        points.clear();
    }
}
