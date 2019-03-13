# Virtual Museum (2019)

A museum of graphics rendering techniques by Peter Gagliardi

This is my Honors Option project for CS 432 Interactive Computer 
Graphics at Drexel University under Professor Breen.

## Usage

This website uses the graphics card extensively, so it will only work
on a laptop/desktop.

Simply visit https://ptrgags.github.io/virtual-museum/ to start exploring!

## Controls

WASD to move around, mouse to move the cursor.

Make sure to click the screen once to hide the cursor.

## Exhibit List

### Toon Shaded Super Seashells

#### Toon Shading

The first exhibit I made was to try out Toon Shading 
(also known as Cel Shading). 

This is but one of a couple ways to implement a cartoon-looking model with
an outline.

The method I used starts with normal Lambert shading (though any lighting
model would work). Next, the colors are bucketed into just a few levels,
this gives it a posterized look.

Second, silhouette edges are computed, and pixels close to this edge
are colored black. This puts an outline around the object, which completes
the cartoony look.

#### Super Seashells

Looking for some interesting objects to toon shade, I decided to try
parametric surfaces. I made a vertex shader that distorts a quad with UV
coordinates into what I call "super seashells".

I designed this family of parametric surfaces as a generalization of several
types of shapes:

* Supertoroids
* Helices
* Seashell Surfaces (helices that taper either linearly or logarithmically)

For the full equations, see the included article 
[Super Seashells](super_seashells.md)

While working on this project, Professor Breen did inform me that this
family of shapes is reminiscent of the shapes shown in Alan Barr's 1984 paper 
"Global and local deformations of solid primitives" (see Bibliography for link)

Barr's method of producing shapes is much a much more general technique.
However, this approach of generating shapes is quite different. 
Barr takes a primitive and applies a transformation to distort it (e.g. by
scaling, twisting or bending). In contrast, super seashells can be imagined
by extruding a cross-section around a coiling path. The cross section is
superelliptical and may change in size, shape or relative orientation along
the path. Furthermore, the coiling path may be planar or helical, and its
overall shape is a superelliptical. It may vary in shape or taper from bottom
to top.

### Julia Set Fractal Sphere

#### About Julia Sets

Julia Sets are a type of fractal defined in the complex plane. Given any 
function

```
f :: Complex -> Complex
f(z) = P(z)/Q(z)
```

where `P(z)` and `Q(z)` are complex polynomials. We can compute orbits
of some point `z0` in the complex plane by finding `z0, f(z0), f^2(z0), ...`
Depending on `f`, some of these orbits will diverge, others will
spiral in towards the origin or even oscillate between points. The Julia
Set is the set of points that remain bounded as the number of iterations
goes to infinity.

The typical algorithhm for plotting a Julia Set is the Escape Time Algorithm,
described in the book Fractals Everywhere by Michael F. Barnsley. In short,
for each point in the complex plane, iterate the funnction up to 
`MAX_ITERATIONS` times. If it leaves a circle (usually radius 2, but this
does not matter) within this time, it is considered outside the set. If
it does not leave the circle, the original point is considered close enough
to be in the set.

The coloring is the interesting part. Usually the color corresponds
to the iteration count. However, this means all the points inside the set
will have the same color since they all took `MAX_ITERATIONS` steps to
compute. I used a hybrid coloring scheme that treats points inside
the set differently:

1. Points inside the set are colored by the length of a polygonal line
    through all the points on the orbit. This gives a rough picture
    of distance traveled
2. Points outside the set are colored not by iteration count, but by
    the angle the point makes with the horizontal upon exiting the circle.
    I found this method on a website about "An algorithmic taxonomy of
    fractals" by Dan Ashlock and Liz Blakenship, though they mention it came
    from Clifford Pickover.
3. The iteration count is used to add alternating bands of darker shading.
    Again, this is only for points outside the Julia Set.

As far as the colors, I used Íñigo Quílez's Cosine palettes (see bibliography
for a link). This method of coloring is simple to use and looks nicer than
most RGB or even HSL palettes.

#### Wrapping up the Complex Plane

I've made Julia Sets and their close cousin, the Mandelbrot set, before. To
do something different, I recalled something else from Fractals Everywhere by
Barnsley: The set was described not on the complex plane but on the Riemann
Sphere. This is just the complex plane wrapped up onto a sphere so infinity
is the north pole and 0 is the south pole.

#### Other Notes

* Unfortunately, Julia sets have a tradeoff between performance and detail.
    I reduced the commplexity of my polynomial and reduced the max iteration
    count to address this, but it still lags on some graphics cards.
* The coefficients of the polynomial oscillate over time. However, an
    added constant is determined by the user's position in the room. The floor
    is essentially a complex plane! the center of the floor is the origin,
    and the walls are a distance 2 from the origin.

### Raymarchers

Raymarching is one of several methods of rendering a 3D scene on a 2D screen.
Or in this case, I render a 3D scene on a 2D screen in the 3D world of the
virtual musem on your 2D monitor in a 3D world. Dizzy yet?

For an in-depth overview on the topic, see [this article](http://jamie-wong.com/2016/07/15/ray-marching-signed-distance-functions/)
by Jamie Wong.

### Box Camera

Unlike most raymarchers that lie on a flat quad in a 2D world, I chose
to render my raymarcher on the wall. Furthermore, I wanted this fancy 3D
wallpaper to react to the player's movement. Thus, the eye and image plane
are passed into the shader dynamically. This allows the player to move around
and see the scene.

#### Constructive Solid Geometry

My raymarchers use CSG operations to define the scene:

* For the sphere lattice room, I start with an infinite lattice of spheres
    and a slightly denser lattice of cylinders along all three directions.
    I subtract the cylinders from the sphere to make the holes.
* For the tubes and cubes room, I start with an infinite lattice of cubes
    and union it with 2D lattices of cylinders. I then subtract out thinner
    cylinders to turn the cylinders into tubes. Finally, I cut the top of
    the first layer by subtracting an infinite slab so it looks like a 
    halfpipe

### Mirror Sphere

The mirror sphere is my first attempt at working with environment maps.
This exhibit was made last-minute, so I only used built-in Three.js classes.
The `CubeCamera` is used to generate a cubemap, and this is passed to
a `MeshBasicMaterial` as a texture. 

There are two scenes: One scene has a room with a ring of colored cubes.
This is the scene used to generate the cubemap each frame.

The second scene contains the same objects, except they are in grayscale.
It also has an additional object: a mirrored ball which uses the cubemap
to produce a reflective surface.

## HUD

This museum provides a map and compass to the user. The compass always points
to the north side of the room, while the map shows you which room you are
in and where the other rooms are.

## Code Overview

**Third party code:**

* `scripts/three.js` -- a Copy of Three.js r100

**JavaScript Code:**

* `scripts/main.js` -- This is the entry point for the application
* `scripts/museum.js` -- This defines the Museum class, which is a high level
    collection of exhibits. This is where the positioning of each room
    is configured, so this file changes the most frequently
* `scripts/museum_layout.js` -- This is a lower-level data structure that
    represents a 2D array of Exhibits
* `scripts/first_person_camera.js` -- This class defines how the user interacts
    with the camera with keyboard and mouse. 
* `hud.js` -- handles rendering 2D overlay for the map and compass
* `sign_maker.js` -- This class handles making signs for thhe doors
* `utils.js` -- miscellaneous helper functions
* `exhibits/*.js` -- look here for the exhibit-specific code

**GLSL Code:**

Vertex Shaders:

* `uv_quad.vert` -- Vertex shader for simple objects that need UV coords
* `super_seashell.vert` -- Vertex shader that defines the super seashell
    geometry

Fragment Shaders:

* `compass.frag` -- Compass HUD component
* `minimap.frag` -- Map HUD component
* `sign.frag` -- Text shader for the door
* `toon.frag` -- Toon shader for the super seashells
* `escape_time_sphere.frag` -- Partial shader for rendering with the escape time
    algorithm on the Riemann Sphere. Used with `julia_sphere.frag`
* `julia_sphere.frag` -- Partial shader for rendering a Julia set on the
    riemann sphere. Requires prepending `escape_time_sphere.frag`
* `raymarch_infinite.frag` -- Partial shader for raymarching scenes
* `sphere_lattice.frag` -- raymarcher for infinite sphere latice with holes
* `tubes.frag` -- raymarcheer for infinite grid of cubes and tubes

## Special Thanks

I would like to thank Professor Breen for letting me do this Honors Option
project and for taking the time to discuss the progress throughout the term!

I would also like to thank some of my friends for testing my project
in advance and providing useful feedback along the way!

* Khanh N. -- First one to note the lag in the Julia sphere room, and provided 
    feedback on choices of colors for some of the exhibits.
* Zacharia T. -- Provided detailed feedback at each major revision
* Ashley C. -- Provided feedback on how to light the super seashell room 
    properly.
* Royce R. -- Informed me my FOV was a bit cramped.

## Annotated Bibliography

* Ashlock, Dan and Blakenship, Liz. [Cosine coloring](http://eldar.mathstat.uoguelph.ca/dashlock/ftax/CosineCol.html)
    part of the website ["An Algorithmic taxonomy of fractals"](http://eldar.mathstat.uoguelph.ca/dashlock/ftax/index.html)
    -- This method of coloring Mandelbrot and Julia sets was used for part of
    the Julia sphere exhibit. The article in turn credits Clifford Pickover's
    website for the idea.
* Barnsley, M. F. *Fractals Everywhere* 2nd ed. Elsevier, 1993 -- This book is
    a wonderful reference when it comes to all sorts of iterated function
    system fractals, including Julia sets.
* Barr, Alan H. [Global and local deformations of solid primitives](https://dl.acm.org/citation.cfm?id=808573).
    Proceedings of SIGGRAPH 1984, ACM SIGGRAPH 1984, pp. 21-30.
    -- this paper about making interesting shapes by transforming primitives 
    is discussed in the above section about superseashells. However, it was
    not used for anything in this project.
* Haugo, Simen. [Raymarching Distance Fields](http://9bitscience.blogspot.com/2013/07/raymarching-distance-fields_14.html)
    -- one of the sites I refer to when recalling details about raymarching
* Quílez, Íñigo. [distance functions](http://www.iquilezles.org/www/articles/distfunctions/distfunctions.htm)
    2008.
    -- this was a helpful reference for designing both raymarched scenes.
* Quílez, Íñigo. [palettes](http://www.iquilezles.org/www/articles/palettes/palettes.htm)
    1999.
    -- Cosine color palettes, not to be confused with the cosine coloring method
    mentioned above for Julia sets. This is my go-to for nice color palettes
    when writing shaders.
* Rost, Randi J. and Licea-Kane, Bill. *OpenGl Shading Language* 3rd Edition. 
    Addison Wesley, 2010 -- This textbook on GLSL inspired the mirror sphere
    shader and many many more ideas I didn't have time to include in this
    project.
* Wong, Jamie. [Ray Marching and Signed Distance Functions](http://jamie-wong.com/2016/07/15/ray-marching-signed-distance-functions/)
    -- Another site I reference when working on raymarched scenes.
