# Super Seashells

It's a supertoroid! It's a shell! It's a helix! No, it's a Super Seashell!

Super seashells are my generalization of several types of parametric surfaces
with the intent of allowing a large shape variation while having a simple
(albeit numerous) set of parameters.

## Overview

It's easiest to think of a super seashell as a variation on a helical
surface. Imagine a circle swept out along a helical path, that gives you
a helix with a circular cross-section.

From there, I make the following changes:

1. The cross section becomes a more general superellipse
2. The shape of the coil also takes the shape of a superellipse. This makes
    the shape reminiscent of a supertoroid.
3. The helix can be tapered linearly to make conical helices and logarithmic
    spirals
4. The helix can be tapered exponentially to make more natural seashell shapes
5. The cross-section can be twisted along the helical path for some neat
    variations.

## Paremeterization

`superseashell(u, v)` describes a point on the surface of a superseashell.
the v direction is along the length of the helix, while the u direction
wraps around the cross section of the shell.

## Parameters

There are 10 pairs of parameters that define a super seashell. Each pair
is an initial and final values of one of the variables in the parametric
equations. The values are interpolated along the length of the coil to allow
for many possible variations.

```
// All 10 parameters below are pairs of floats

// Radius of the helical coil
coil_radius = (R0, Rf)
// exponent to put into e^(bv) to make logarithmic spirals
coil_logarithm = (b0, bf)
// Initial and final angles in radians. For a helix, set phif much greater
// than 2 pi
coil_angle = (phi0, phif)
// height of each end of the helix along the axis of the helix
coil_z = (z0, zf)
// Exponents for the superellipse for the coil shape
coil_p = (p0, pf)
coil_q = (q0, qf)

// Radius of the cross section. This can be tapered over the length of the
// shell.
cross_section_radius = (r0, rf)
// Orientation angle of the cross section. If non-constant, this produces
// a twist along the length of the coil.
cross_section_twist = (delta0, deltaf)
// Exponents for the superelliptical cross-section
cross_section_n = (n0, nf)
cross_section_m = (m0, mf)
```

Now there are several more variables I could have added to the definition,
but I felt that 20 was a nice round number to stop at.

## Parameter Interpolation

Most of the parameters are interpolated linearly, but expoents I have
interpolated linearly in log space to allow a greater range. Let's define
the following functions:

```
lerp(a0, af, t) = (1 - t) * a0 + t * af
loglerp(a0, af, t) = a0^(1 - t) * af^t
```

Then the parameters are interpolated as follows, always in the v direction:

```
// Coil variables
R(v) = lerp(R0, Rf, v)
b(v) = loglerp(b0, bf, v)
phi(v) = lerp(phi0, phif, v)
z(v) = lerp(z0, zf, v)
p(v) = loglerp(p0, pf, v)
q(v) = loglerp(q0, qf, v)

// Cross-section variables
r(v) = lerp(r0, rf, v)
delta(v) = lerp(delta0, deltaf, v)
n(v) = loglerp(n0, nf, v)
m(v) = loglerp(m0, mf, v)
```

In what folllows, I will drop the parentheses after each function for
readability.

## SuperSeashell Definition

A superseashell is defined most simply by taking a point on the helical path
and adding to it an offset that moves to a point on the cross-section.

```
superseashell :: [0, 1]^2 -> R^3
superseashell(u, v) = coil(v) + cross_section(u, v)
```

The coil is defined like a helix, except instead of a circular shape,
it uses a superellipse. Furthermore, a `e^(b(v) * v)` mulitplier is thrown
in to allow the coil to make a logarithmic spiral when vieweed from the top.

Note that that b, phi, p, q, z are functions of v, as mentioned in the
previous section.

```
coil :: [0, 1] -> R^3
coil(v) = [Re^(bv) * superellipse(phi, p, q).x]
          [Re^(bv) * superellipse(phi, p, q).y]
          [  z                                ]
```

The `superellipse()` function takes the parametric equations for a unit circle
and generalizes it where the cosine and sine can be raised to arbitrary powers.
See [Superellipse](http://mathworld.wolfram.com/Superellipse.html) on Wolfram
Alpha for more information.

```
superellipse :: R x R x R -> R^2
superellipse(theta, m, n) = [supercos(theta, m)]
                            [supersin(theta, n)]

supercos :: R x R -> R
supercos(theta, m) = sgn(cos theta) * |cos theta|^(2/n)

supersin :: R x R -> R
supersin(theta, m) = sgn(sin theta) * |sin theta|^(2/n)
```

Next, the cross section offset is the cross-section shape rotated around the
coil's axis (in a superelliptical path of course, with the coil angle phi:

```
cross_section :: [0, 1]^2 -> R^3
cross_section(u, v) = [twisted(u, v).s * superellipse(phi, p, q).x]
                      [twisted(u, v).s * superellipse(phi, p, q).y]
                      [twisted(u, v).z                            ]
```

Note that `twisted()` (defined below) is a vector in cylindrical coordinates
`(s, phi, z)`, though the phi component is not needed so it is dropped to get
`(s, z)`. s is the radial direction while z is the axial direction.

As for the shape of the cross section, it starts out as a superellipse.
However, we rotate it in the sz-plane in cylindrical coordinates with an
angle that varies with the v parameter. This produces a twist in the seashell
shape which can be used to add a bit of flair to the seashell shapes.

```
twisted :: [0, 1]^2 -> R^2
twisted(u, v) = rotate_sz(delta) * superellipse(theta, m, n)

rotate_sz :: R -> M_2
rotate_sz(delta) = [cos(delta), -sin(delta)]
                   [sin(delta),  cos(delta)]

theta :: [0, 1] -> [0, 2 pi]
theta(u) = 2 pi * u
```

In the above, remember that `twisted()` is defined in sz-coordinates in
the cylindrical coordinates of the helix. The rotation matrix is a typical
2D rotation matrix, just performed in the same sz-coordinate system.

## Example Shapes

The definition of superseashells includes many simpler shapes. Here are
some notable ones and how to set the parameters for them. 

### Helical Surfaces

```
R = constant (i.e. R0 = Rf)
r = constant
m = n = p = q = 2 (circle)
(z0, zf) = desired bottom and top heights of the helix. This controls the
           height of the helix
delta = 0
b = 0
phi0 = 0
phif = 8 pi or some other angle greater than 2 pi depending on the desired
            number of turns
```

### Supertoroid

```
R = constant
r = constant
m, n, p, q all constant, but can be varied to change the shape. 2 give
           circular shapes, >2 give rounded rectangles, <2 gives star shapes
z = constant
delta = 0
b = 0
(phi0, phif) = (0, 2 pi)
```

### Archimedian Spiral Shell

```
R0 = desired radius of the coil
Rf = 0
r0 = desired max cross sectional radius
rf = 0
m = n = p = q = 2
z = constant
delta = 0
b = 0
(phi0, phif) = (0, 8 pi) or some other angle much larger than 2 pi
```

### Logarithmic Spiral Shell

```
R = small constant for start radius (e.g. 0.1)
b = desired exponent (e.g. 2.5). For positive values the shell spirals 
    outwards
r0 = 0
rf = desired max cross section radius (e.g. 0.3)
m = n = p = q = 2
z = constant
delta = 0
(phi0, phif) = (0, 8 pi) or some other angle much larger than 2 pi
```

### Seashell Surface

```
R0 = desired radius of wide end of the shell (e.g. 0.5)
Rf = 0
r0 = desired max radius of cross section (e.g. 0.4)
rf = 0
m = n = p = q = 2
z0 = 0
zf = desired height (e.g. 3)
delta = 0
b = 0
(phi0, phif) = (0, 10 pi) or some other large max angle
```
