package web;

import java.math.BigDecimal;

public class Calculator {
    private static boolean isInRectangle(BigDecimal x, float y, float r) {
        return (x.compareTo(BigDecimal.ZERO) <= 0
                && y <= 0
                && x.compareTo(BigDecimal.valueOf(-r)) >= 0
                && y >= -r/2);
    }

    private static boolean isInTriangle(BigDecimal x, float y, float r) {
        BigDecimal ybd = BigDecimal.valueOf(y);
        BigDecimal rbd = BigDecimal.valueOf(r);

        return (x.compareTo(BigDecimal.ZERO) >= 0
                && y >= 0
                && rbd.subtract(x.multiply(BigDecimal.valueOf(2.0)))
                        .compareTo(ybd) >= 0);
    }

    private static boolean isInCircle(BigDecimal x, float y, float r) {
        BigDecimal ybd = BigDecimal.valueOf(y);
        BigDecimal rbd = BigDecimal.valueOf(r);

        return (x.compareTo(BigDecimal.ZERO) >= 0
                && y <= 0
                && x.multiply(x).add(ybd.multiply(ybd))
                        .compareTo(rbd.multiply(rbd)) <= 0);
    }

    public static boolean calculateHit(BigDecimal x, float y, float r) {
        return isInRectangle(x, y, r) || isInTriangle(x, y, r) || isInCircle(x, y, r);
    }
}
