import connectDB from "@/lib/mongodb";
import Ticket from "@/models/Ticket";

// GET - Get one ticket
export async function GET(request, { params }) {
  try {
    await connectDB();

    const { id } = await params;

    const ticket = await Ticket.findById(id).populate("category");

    if (!ticket) {
      return Response.json(
        { message: "Ticket not found" },
        { status: 404 }
      );
    }

    return Response.json(ticket);
  } catch (error) {
    console.error(error);

    return Response.json(
      { message: "Failed to get ticket" },
      { status: 500 }
    );
  }
}

// PUT - Update a ticket
export async function PUT(request, { params }) {
  try {
    await connectDB();

    const { id } = await params;
    const body = await request.json();

    const ticket = await Ticket.findByIdAndUpdate(
      id,
      {
        title: body.title,
        description: body.description,
        category: body.category,
        status: body.status,
        priority: body.priority,
      },
      {
        new: true,
        runValidators: true,
      }
    ).populate("category");

    if (!ticket) {
      return Response.json(
        { message: "Ticket not found" },
        { status: 404 }
      );
    }

    return Response.json(ticket);
  } catch (error) {
    console.error(error);

    return Response.json(
      { message: "Failed to update ticket" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a ticket
export async function DELETE(request, { params }) {
  try {
    await connectDB();

    const { id } = await params;

    const ticket = await Ticket.findByIdAndDelete(id);

    if (!ticket) {
      return Response.json(
        { message: "Ticket not found" },
        { status: 404 }
      );
    }

    return Response.json({
      message: "Ticket deleted successfully",
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      { message: "Failed to delete ticket" },
      { status: 500 }
    );
  }
}