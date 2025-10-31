package web.model;

import java.math.BigDecimal;

public class PointChecker {
    private static boolean isInRectangle(UncheckedPoint p) {
        BigDecimal halfR = p.r().multiply(BigDecimal.valueOf(0.5));

        return (p.x().compareTo(BigDecimal.ZERO) <= 0
                && p.x().compareTo(halfR.negate()) >= 0
                && p.y().compareTo(BigDecimal.ZERO) >= 0
                && p.y().compareTo(p.r()) <= 0);
    }

    private static boolean isInCircle(UncheckedPoint p) {
        BigDecimal halfR = p.r().multiply(BigDecimal.valueOf(0.5));
        BigDecimal sqrX = p.x().pow(2);
        BigDecimal sqrY = p.y().pow(2);
        BigDecimal sqrHalfR = halfR.pow(2);

        return (p.x().compareTo(BigDecimal.ZERO) >= 0
                && p.y().compareTo(BigDecimal.ZERO) >= 0
                && sqrX.add(sqrY).compareTo(sqrHalfR) <= 0);
    }

    private static boolean isInTriangle(UncheckedPoint p) {
        BigDecimal halfR = p.r().multiply(BigDecimal.valueOf(0.5));

        return (p.x().compareTo(BigDecimal.ZERO) <= 0
                && p.y().compareTo(BigDecimal.ZERO) <= 0
                && p.x().negate().subtract(halfR).compareTo(p.y()) <= 0);
    }

    private static boolean isInside(UncheckedPoint p) {
        return isInRectangle(p) || isInCircle(p) || isInTriangle(p);
    }

    public static Point checkPoint(UncheckedPoint p) {
        return new Point(p.x(), p.y(), p.r(), isInside(p));
    }
}
