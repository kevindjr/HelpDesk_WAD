import connectDB from "@/lib/mongodb";
import Comment from "@/models/Comment";

// GET - Get one comment
export async function GET(request, { params }) {
  try {
    await connectDB();

    const { id } = await params;

    const comment = await Comment.findById(id).populate("ticket");

    if (!comment) {
      return Response.json(
        { message: "Comment not found" },
        { status: 404 }
      );
    }

    return Response.json(comment);
  } catch (error) {
    console.error(error);

    return Response.json(
      { message: "Failed to get comment" },
      { status: 500 }
    );
  }
}

// PUT - Update a comment
export async function PUT(request, { params }) {
  try {
    await connectDB();

    const { id } = await params;
    const body = await request.json();

    const comment = await Comment.findByIdAndUpdate(
      id,
      {
        ticket: body.ticket,
        message: body.message,
        author: body.author,
      },
      {
        new: true,
        runValidators: true,
      }
    ).populate("ticket");

    if (!comment) {
      return Response.json(
        { message: "Comment not found" },
        { status: 404 }
      );
    }

    return Response.json(comment);
  } catch (error) {
    console.error(error);

    return Response.json(
      { message: "Failed to update comment" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a comment
export async function DELETE(request, { params }) {
  try {
    await connectDB();

    const { id } = await params;

    const comment = await Comment.findByIdAndDelete(id);

    if (!comment) {
      return Response.json(
        { message: "Comment not found" },
        { status: 404 }
      );
    }

    return Response.json({
      message: "Comment deleted successfully",
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      { message: "Failed to delete comment" },
      { status: 500 }
    );
  }
}