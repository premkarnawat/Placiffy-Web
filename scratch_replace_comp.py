import os

filepath = r"c:\Users\premk\.gemini\antigravity\playground\ruby-galaxy\app\admin\companies\[id]\page.tsx"

with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

target = """  const handleMessageCompany = async () => {
    if (!adminUser || !data?.company) return;
    try {
      setMsgLoading(true);
      const companyUserId = data.company.user_id;
      
      // Check if conversation already exists between Admin and Company
      const { data: existingConvs } = await supabase.rpc('get_direct_conversation', {
        user1_id: adminUser.id,
        user2_id: companyUserId
      });
      
      if (existingConvs && existingConvs.length > 0) {
        // Just navigate to messages page and ideally we'd pass the conv ID or it would be first
        router.push('/admin/messages');
        return;
      }
      
      // If no function, manually check or create
      // We will create a new conversation
      const { data: newConv, error: convErr } = await supabase.from('conversations').insert({
        type: 'support',
        status: 'open'
      }).select().single();
      if (convErr) throw convErr;
      
      await supabase.from('conversation_participants').insert([
        { conversation_id: newConv.id, user_id: adminUser.id, role: 'admin' },
        { conversation_id: newConv.id, user_id: companyUserId, role: 'company' }
      ]);
      
      router.push('/admin/messages');
    } catch (e) {
      console.error(e);
    } finally {
      setMsgLoading(false);
    }
  };"""

replacement = """  const handleMessageCompany = async () => {
    if (!adminUser || !data?.company) return;
    try {
      setMsgLoading(true);
      const companyUserId = data.company.user_id;
      
      // Check if conversation already exists where BOTH admin and company are participants
      const { data: adminConvs } = await supabase.from('conversation_participants').select('conversation_id').eq('user_id', adminUser.id);
      
      let existingConvId = null;
      if (adminConvs && adminConvs.length > 0) {
        const convIds = adminConvs.map(c => c.conversation_id);
        const { data: sharedConvs } = await supabase.from('conversation_participants')
          .select('conversation_id')
          .in('conversation_id', convIds)
          .eq('user_id', companyUserId);
          
        if (sharedConvs && sharedConvs.length > 0) {
           existingConvId = sharedConvs[0].conversation_id;
        }
      }
      
      if (existingConvId) {
        router.push('/admin/messages');
        return;
      }
      
      const { data: newConv, error: convErr } = await supabase.from('conversations').insert({
        type: 'support',
        status: 'open'
      }).select().single();
      if (convErr) throw convErr;
      
      await supabase.from('conversation_participants').insert([
        { conversation_id: newConv.id, user_id: adminUser.id, role: 'admin' },
        { conversation_id: newConv.id, user_id: companyUserId, role: 'company' }
      ]);
      
      router.push('/admin/messages');
    } catch (e) {
      console.error(e);
    } finally {
      setMsgLoading(false);
    }
  };"""

if target in content:
    new_content = content.replace(target, replacement)
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(new_content)
    print("Replaced successfully")
else:
    print("Target not found")
