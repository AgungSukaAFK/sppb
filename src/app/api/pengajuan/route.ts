import jsonResponse from "@/utils/jsonResponse";

export async function GET(){
    return jsonResponse({message: "It worked"})
}