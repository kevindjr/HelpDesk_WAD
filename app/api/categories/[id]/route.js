import connectDB from "@/lib/mongodb";
import Category from "@/models/Category";
import Ticket from "@/models/Ticket";

// GET - Get one category
export async function GET(request, { params }) {
  try {
    await connectDB();

    const { id } = await params;

    const category = await Category.findById(id);

    if (!category) {
      return Response.json(
        { message: "Category not found" },
        { status: 404 }
      );
    }

    return Response.json(category);
  } catch (error) {
    console.error(error);

    return Response.json(
      { message: "Failed to get category" },
      { status: 500 }
    );
  }
}

// PUT - Update a category
export async function PUT(request, { params }) {
  try {
    await connectDB();

    const { id } = await params;
    const body = await request.json();

    const category = await Category.findByIdAndUpdate(
      id,
      {
        name: body.name,
        description: body.description,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!category) {
      return Response.json(
        { message: "Category not found" },
        { status: 404 }
      );
    }

    return Response.json(category);
  } catch (error) {
    console.error(error);

    return Response.json(
      { message: "Failed to update category" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a category
export async function DELETE(request, { params }) {
  try {
    await connectDB();

    const { id } = await params;

    const category = await Category.findById(id);

    if (!category) {
      return Response.json(
        { message: "Category not found" },
        { status: 404 }
      );
    }

    const ticketUsingCategory = await Ticket.findOne({
      category: id,
    });

    if (ticketUsingCategory) {
      return Response.json(
        {
          message:
            "Cannot delete this category because it is being used by a ticket.",
        },
        { status: 400 }
      );
    }

    await Category.findByIdAndDelete(id);

    return Response.json({
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      { message: "Failed to delete category" },
      { status: 500 }
    );
  }
}