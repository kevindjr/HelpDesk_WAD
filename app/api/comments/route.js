import connectDB from "@/lib/mongodb";
import Comment from "@/models/Comment";

// GET - Get all comments
export async function GET() {
  try {
    await connectDB();

    const comments = await Comment.find()
      .populate("ticket")
      .sort({ createdAt: -1 });

    return Response.json(comments);
  } catch (error) {
    console.error(error);

    return Response.json(
      { message: "Failed to get comments" },
      { status: 500 }
    );
  }
}

// POST - Create a comment
export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();

    const comment = await Comment.create({
      ticket: body.ticket,
      message: body.message,
      author: body.author,
    });

    const populatedComment = await comment.populate("ticket");

    return Response.json(populatedComment, { status: 201 });
  } catch (error) {
    console.error(error);

    return Response.json(
      { message: "Failed to create comment" },
      { status: 500 }
    );
  }
}