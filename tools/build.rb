require 'sha1'

app_name = 'cachetoggle'
version = '0.5'
uri = 'http://pau.santesmasses.net/cachetoggle/releases/'

system("rm -rf ../build/* && cp -r ../src/* ../build/ && cd ../build && zip -rm #{app_name}.#{version}.xpi .  -x '*.DS_Store' && cd ..")

hash = Digest::SHA1.hexdigest(File.read("../build/#{app_name}.#{version}.xpi"))

update_rdf = <<XML
<?xml version="1.0"?>
<r:RDF xmlns:r="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
       xmlns="http://www.mozilla.org/2004/em-rdf#">
<!-- #{app_name} Extension -->
<r:Description about="urn:mozilla:extension:#{app_name}@pau.santesmasses.net">
  <updates>
    <r:Seq>
      <r:li>
        <r:Description>
          <version>#{version}</version>
          <targetApplication>
            <r:Description>
              <id>{ec8030f7-c20a-464f-9b0e-13a3a9e97384}</id>
              <minVersion>3.0</minVersion>
              <maxVersion>3.6a1pre</maxVersion>
              <updateLink>#{uri}#{app_name}.#{version}.xpi</updateLink>
              <updateHash>sha1:#{hash}</updateHash>
            </r:Description>
          </targetApplication>
        </r:Description>
      </r:li>
    </r:Seq>
  </updates>
  <version>#{version}</version>
  <updateLink>#{uri}#{app_name}.#{version}.xpi</updateLink>
</r:Description>
</r:RDF>
XML

File.open('../build/update.rdf', 'w') do |f|
  f.write update_rdf
end

p "Don't forget to sign the update.rdf!!!"
