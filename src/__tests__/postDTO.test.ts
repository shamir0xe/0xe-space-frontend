import { describe, it, expect } from "vitest";
import postDTO from "@/models/dtos/postDTO";

describe("postDTO", () => {
  const raw = {
    id: "42",
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-06-01T12:30:00Z",
    content: "## Hello\nworld",
    title: "Test Post",
    rating_avg: 4.5,
  };

  it("maps all fields", () => {
    const post = postDTO(raw);
    expect(post.id).toBe("42");
    expect(post.content).toBe("## Hello\nworld");
    expect(post.title).toBe("Test Post");
    expect(post.rating_avg).toBe(4.5);
  });

  it("parses created_at as a Date", () => {
    const post = postDTO(raw);
    expect(post.created_at).toBeInstanceOf(Date);
    expect(post.created_at.getFullYear()).toBe(2024);
  });

  it("parses updated_at as a Date", () => {
    const post = postDTO(raw);
    expect(post.updated_at).toBeInstanceOf(Date);
    expect(post.updated_at.getMonth()).toBe(5); // June = 5 (0-indexed)
  });

  it("defaults rating_avg to -1 when absent", () => {
    const post = postDTO({ ...raw, rating_avg: undefined });
    expect(post.rating_avg).toBe(-1);
  });

  it("defaults rating_avg to -1 when null", () => {
    const post = postDTO({ ...raw, rating_avg: null });
    expect(post.rating_avg).toBe(-1);
  });
});
