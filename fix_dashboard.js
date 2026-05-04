const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'app', 'dashboard', 'page.tsx');
let content = fs.readFileSync(file, 'utf8');

const replacement = `            <ActionCard
              title="LinkedIn Automation"
              description="Automate posts, connections, and outreach"
              icon={Linkedin}
              buttonText="Setup"
              onAction={() => window.location.href = "/dashboard/linkedin"}
            />
            <ActionCard
              title="Instagram Integration"
              description="Automate social media posting"
              icon={Instagram}
              buttonText="Connect"
              onAction={() => window.location.href = "/dashboard/instagram"}
            />
          </div>
        </TabsContent>
      </Tabs>

      {/* Recent Activity */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>Recent Activity</span>
            </div>
            <Button variant="ghost" size="sm" onClick={fetchStats} disabled={isLoadingStats}>
              {isLoadingStats ? <Loader2 className="h-4 w-4 animate-spin" /> : "Refresh"}
            </Button>
          </CardTitle>`;

// Search for the exact string to replace using regular expressions to ignore newlines issues
content = content.replace(/<ActionCard\s+title="LinkedIn Automation"\s+<\/CardTitle>/, replacement);

fs.writeFileSync(file, content);
console.log('Fixed dashboard');
