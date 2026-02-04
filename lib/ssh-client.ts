import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

interface SSHConfig {
    host: string;
    username: string;
    privateKey: string;
}

const config: SSHConfig = {
    host: process.env.CLUSTER_HOST || 'your-cluster-ip',
    username: process.env.CLUSTER_USER || 'saurabhgaikwad',
    privateKey: process.env.SSH_KEY_PATH || '/path/to/your/id_rsa'
};

let isConnected = false;

export const connectToCluster = async (): Promise<NodeSSH> => {
    if (!isConnected) {
        await ssh.connect({
            host: config.host,
            username: config.username,
            privateKey: config.privateKey
        });
        isConnected = true;
    }
    return ssh;
};

export const executeCommand = async (command: string): Promise<string> => {
    const connection = await connectToCluster();
    const result = await connection.execCommand(command);
    
    if (result.stderr) {
        console.error('SSH Error:', result.stderr);
    }
    
    return result.stdout;
};

export const submitJob = async (
    genesisPrompt: string,
    previousContext?: string,
    choicePrompt?: string
): Promise<{ jobId: string; outputPath: string }> => {
    const connection = await connectToCluster();
    
    // Build the prompt with context
    const fullPrompt = previousContext 
        ? `${previousContext}\n\nNext scene: ${choicePrompt || genesisPrompt}`
        : genesisPrompt;
    
    // Escape the prompt for shell
    const escapedPrompt = fullPrompt.replace(/'/g, "'\\''");
    
    // Submit the job via sbatch
    const result = await connection.execCommand(
        `sbatch --export=PROMPT='${escapedPrompt}' run_pipeline.sh`
    );
    
    // Extract job ID from sbatch output (e.g., "Submitted batch job 12345")
    const jobIdMatch = result.stdout.match(/Submitted batch job (\d+)/);
    const jobId = jobIdMatch ? jobIdMatch[1] : 'unknown';
    
    return {
        jobId,
        outputPath: `/output/video_${jobId}.mp4`
    };
};

export const checkJobStatus = async (jobId: string): Promise<'pending' | 'running' | 'completed' | 'failed'> => {
    const connection = await connectToCluster();
    const result = await connection.execCommand(`squeue -j ${jobId} -h -o "%t"`);
    
    const status = result.stdout.trim();
    
    if (!status) {
        // Job not in queue - either completed or failed
        const outputCheck = await connection.execCommand(`ls /output/video_${jobId}.mp4 2>/dev/null`);
        return outputCheck.stdout.trim() ? 'completed' : 'failed';
    }
    
    switch (status) {
        case 'PD': return 'pending';
        case 'R': return 'running';
        case 'CD': return 'completed';
        case 'F': return 'failed';
        default: return 'running';
    }
};

export const getLatestVideo = async (): Promise<string | null> => {
    const connection = await connectToCluster();
    const result = await connection.execCommand(
        'ls -t /output/*.mp4 2>/dev/null | head -1'
    );
    
    return result.stdout.trim() || null;
};

export const disconnectFromCluster = async (): Promise<void> => {
    if (isConnected) {
        ssh.dispose();
        isConnected = false;
    }
};

