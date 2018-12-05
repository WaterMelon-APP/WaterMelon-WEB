//
//  ViewControllerEventManagerController.swift
//  Watermelon
//
//  Created by Paul Rouillard on 04/12/2018.
//  Copyright © 2018 Paul Rouillard. All rights reserved.
//

import UIKit

class ViewControllerEventManagerController: UIViewController, UITableViewDataSource, UITableViewDelegate
{

    

    @IBOutlet weak var input: UITableView!
    var array: [String] = []
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int
    {
        return self.array.count
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell
    {
        let cell = tableView.dequeueReusableCell(withIdentifier: "cell", for: indexPath)
        cell.textLabel?.text = self.array[indexPath.row]
        return cell
    }
    
    override func viewDidLoad()
    {
        super.viewDidLoad()
    }

    @IBAction func addText(_ sender: UITextField)
    {
        if !((sender.text?.isEmpty)!)
        {
            self.array.append(sender.text!)
            self.input.reloadData()
            sender.text = ""
        }
    }
    
    func tableView(_ tableView: UITableView, commit editingStyle: UITableViewCell.EditingStyle, forRowAt indexPath: IndexPath) {
        if editingStyle == .delete
        {
            self.array.remove(at: indexPath.row)
            self.input.reloadData()
        }
    }
}
