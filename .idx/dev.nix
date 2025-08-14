{pkgs}: {
  channel = "stable-24.05";
  packages = [
    pkgs.nodejs_20
  ];
  env = {
    PORT= "3001";
  };
  idx.extensions = [
    "svelte.svelte-vscode"
    "vue.volar"
  ];
  idx.previews = {
    previews = {
      web = {
        command = [ 
          "concurrently"
          "\"vite --port $PORT --host 0.0.0.0\""
          "\"node server/server.js --port 3001 --host 0.0.0.0\""
          "--names"
          "\"vite,server\""
        ];
        manager = "web";
      };
    };
  };
}