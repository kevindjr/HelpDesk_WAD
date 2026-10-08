import connectDB from "@/lib/mongodb";
import Category from "@/models/Category";


// GET - Get all categories
export async function GET() {
  try {
    await connectDB();

    const categories = await Category.find().sort({ createdAt: -1 });

    return Response.json(categories);
  } catch (error) {
    console.error(error);

    return Response.json(
      { message: "Failed to get categories" },
      { status: 500 }
    );
  }
}


// POST - Create a category
export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();

    const category = await Category.create({
      name: body.name,
      description: body.description,
    });

    return Response.json(category, { status: 201 });
  } catch (error) {
    console.error(error);

    return Response.json(
      { message: "Failed to create category" },
      { status: 500 }
    );
  }
}