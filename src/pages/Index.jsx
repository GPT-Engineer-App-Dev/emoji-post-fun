import { useState, useEffect } from "react";
import { Container, VStack, Text, Box, Input, Button, HStack, IconButton } from "@chakra-ui/react";
import { FaThumbsUp, FaThumbsDown, FaLaugh, FaSadTear } from "react-icons/fa";
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_PROJECT_URL;
const supabaseKey = process.env.SUPABASE_API_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const Index = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const { data } = await supabase.from('posts').select('*');
    setPosts(data);
  };

  const addPost = async () => {
    if (newPost.trim() !== "") {
      const { data } = await supabase
        .from('posts')
        .insert([{ title: newPost, body: newPost }])
        .select();
      setPosts([...posts, ...data]);
      setNewPost("");
    }
  };

  const addReaction = async (postId, reaction) => {
    const post = posts.find(p => p.id === postId);
    const updatedReactions = { ...post.reactions, [reaction]: (post.reactions[reaction] || 0) + 1 };
    await supabase
      .from('posts')
      .update({ reactions: updatedReactions })
      .eq('id', postId);
    fetchPosts();
  };

  return (
    <Container centerContent maxW="container.md" py={10}>
      <VStack spacing={4} width="100%">
        <Text fontSize="2xl" fontWeight="bold">Public Postboard</Text>
        <HStack width="100%">
          <Input
            placeholder="Write a new post..."
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
          />
          <Button onClick={addPost} colorScheme="blue">Post</Button>
        </HStack>
        <VStack spacing={4} width="100%">
          {posts.map((post) => (
            <Box key={post.id} p={4} borderWidth="1px" borderRadius="md" width="100%">
              <Text>{post.body}</Text>
              <HStack spacing={2} mt={2}>
                <IconButton
                  aria-label="Like"
                  icon={<FaThumbsUp />}
                  onClick={() => addReaction(post.id, "like")}
                />
                <Text>{post.reactions?.like || 0}</Text>
                <IconButton
                  aria-label="Dislike"
                  icon={<FaThumbsDown />}
                  onClick={() => addReaction(post.id, "dislike")}
                />
                <Text>{post.reactions?.dislike || 0}</Text>
                <IconButton
                  aria-label="Laugh"
                  icon={<FaLaugh />}
                  onClick={() => addReaction(post.id, "laugh")}
                />
                <Text>{post.reactions?.laugh || 0}</Text>
                <IconButton
                  aria-label="Sad"
                  icon={<FaSadTear />}
                  onClick={() => addReaction(post.id, "sad")}
                />
                <Text>{post.reactions?.sad || 0}</Text>
              </HStack>
            </Box>
          ))}
        </VStack>
      </VStack>
    </Container>
  );
};

export default Index;