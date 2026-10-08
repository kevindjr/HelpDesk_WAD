import connectDB from "@/lib/mongodb";
import Ticket from "@/models/Ticket";
import Category from "@/models/Category";

// GET - Get all tickets
export async function GET() {
  try {
    await connectDB();

    const tickets = await Ticket.find()
      .populate("category")
      .sort({ createdAt: -1 });

    return Response.json(tickets);
  } catch (error) {
    console.error(error);

    return Response.json(
      { message: "Failed to get tickets" },
      { status: 500 }
    );
  }
}


// POST - Create a ticket
export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();

    const ticket = await Ticket.create({
      title: body.title,
      description: body.description,
      category: body.category,
      status: body.status,
      priority: body.priority,
    });

    const populatedTicket = await ticket.populate("category");

    return Response.json(populatedTicket, { status: 201 });
  } catch (error) {
    console.error(error);

    return Response.json(
      { message: "Failed to create ticket" },
      { status: 500 }
    );
  }
}